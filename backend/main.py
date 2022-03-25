import functools
from fastapi import Body, Response, FastAPI, UploadFile, Request, Form, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pymongo
import shutil
import pandas as pd

DBPORT = '27017'
DBHOST = 'localhost'

origins = [
    "http://localhost:3000",
    "http://frontend:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/api/info')
def get_necessary_info(response: Response, planos: str):
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client["planos"]
		planos_info = planos_db['planos_info']

		planos_list = planos.split('/')
		result = list(planos_info.find({"plano" : {"$in": planos_list}}))
		if not result:
			response.status_code = 404
			return {"message": "Plano não existente"}

		result_list = [r['info'] for r in result]

		necessary_info = set().union(*result_list)

		return {'info': necessary_info}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/info')
def set_new_info(response: Response, body: dict = Body(...)):
	plano = body['plano'].strip()
	info = [i.strip() for i in body['info']]
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client["planos"]
		planos_info = planos_db['planos_info']

		result = planos_info.find_one({"plano": plano})
		if result is not None:
			response.status_code = 409
			return {"message": "Plano já existente"}

		planos_info.insert_one({"plano": plano, "info": info})

		return body
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.get('/api/planos')
def get_planos(response: Response):
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client["planos"]
		planos_info = planos_db['planos_info']

		result = planos_info.find()

		return {"planos": [r['plano'] for r in result]}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/novo_beneficiario')
def set_new_user(response: Response, body = Body(...)):
	# Quais serão os valores tomados como identificadores de usuários
	identificadores = ['Nome', 'CPF']

	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.find_one(
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]}
		)
		if result is not None:
			response.status_code = 409
			return {"message": "Usuário já existente"}
		
		usuarios_info.insert_one(info)
		return body

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.patch('/api/add_plano_user')
def add_plano_user(response: Response, body = Body(...)):
	# Quais serão os valores tomados como identificadores de usuários
	identificadores = ['Nome', 'CPF']

	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.find_one(
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]}
		)
		if result is None:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}

		for key in result.keys():
			if key in info.keys():
				if info[key] != result[key]:
					response.status_code = 422
					return {"message": "Dados conflitantes"}

		result = usuarios_info.update_one(
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]},
			{"$set": info}
		)

		return body

	except BaseException as e:
		print(e)
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.patch('/api/change_user_info')
def change_user_info(response: Response, body = Body(...)):
	# Quais serão os valores tomados como identificadores de usuários
	identificadores = ['Nome', 'CPF']

	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.update_one(
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]},
			{"$set": info}
		)
		if result.matched_count == 0:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}

		return body

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/upload_table')
async def add_table(request: Request, response: Response):
	identificadores = ['Nome', 'CPF']

	try:
		form = await request.form()
		base = form['base']
		empresa = form['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	with open(f"{base.filename}", "wb") as buffer:
		shutil.copyfileobj(base.file, buffer)

	df = pd.read_csv(base.filename)

	# Verificar se há duplicatas na tabela e, caso houver, retornar
	# os identificadores para o usuário
	duplicates = [df.duplicated(subset=[x], keep=False)
				  for x in identificadores if x in df.columns]
	if any([x.any() for x in duplicates]):
		dup = functools.reduce(
			lambda acc, val: acc | val,
			duplicates,
			pd.Series([False] * len(duplicates[0]))
		)
		response.status_code = 409
		return {
			"messages": "Usuários duplicados na tabela",
			'usuarios': df[dup][[x for x in identificadores
								 if x in df.columns]].to_dict(orient='list')
		}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		usuarios_info.drop()

		usuarios_info.insert_many(df.to_dict('records'))

		return {"message": "Banco de dados criado com sucesso"}

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}