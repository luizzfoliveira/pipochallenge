import functools
import os
import string
from fastapi import Body, FastAPI, Request, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pymongo
import shutil
import pandas as pd
import bcrypt
import jwt

DBPORT = '27017'
DBHOST = 'localhost'

JWT_SECRET = os.getenv('JWT_SECRET')

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

def check_jwt(token: str) -> bool:
	try:
		jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
		return True
	except:
		return False

def check_token(request: Request):
	try:
		token = request.headers['authorization']
	except:
		return False, "Falta token de acesso"
	temp = token.split()
	if temp[0] != 'Bearer':
		return False, "Falta token de acesso"
	if not check_jwt(temp[1]):
		return False, "Não autorizado"
	return True, "sucesso"

@app.get('/api/info')
def get_necessary_info(response: Response, planos: str, request: Request):
	# verified, message = check_token(request)
	# if not verified:
	# 	response.status_code = 401
	# 	return {"message": message}

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
def set_new_info(response: Response, request: Request, body: dict = Body(...)):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

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
def get_planos(response: Response, request: Request):
	# verified, message = check_token(request)
	# if not verified:
	# 	response.status_code = 401
	# 	return {"message": message}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client["planos"]
		planos_info = planos_db['planos_info']

		result = planos_info.find()

		return {"planos": [r['plano'] for r in result]}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.get('/api/user')
def get_user_info(response: Response, request: Request, ident: str, empresa: str):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}
	identificadores = ['Nome', 'CPF']

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.find_one(
			{"$or" : [{i: ident} for i in identificadores]},
			{'_id': 0}
		)
		if result is None:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}
		
		return result

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/novo_beneficiario')
def set_new_user(response: Response, request: Request, body = Body(...)):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

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
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]},
			{"_id": 0}
		)
		if result is not None:
			response.status_code = 409
			message = ""
			count = 0
			for ident in identificadores:
				if ident in result.keys() and\
					ident in info.keys() and\
					result[ident] == info[ident]:
					if count > 0:
						message += ", "
					message += f"{ident}: {result[ident]}"
					count += 1
			if count == 1:
				message += " já está sendo usado"
			else:
				message += " já estão sendo usados"
			return {"message": message}
		
		result = usuarios_info.insert_one(info)

		return {"message": "Usuario adicionado com sucesso"}

	except BaseException as e:
		print(e)
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.patch('/api/update_user')
def add_plano_user(response: Response, request: Request, body = Body(...)):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

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

@app.patch('/api/change_user')
def change_user_info(response: Response, request: Request, body: dict = Body(...)):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

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

@app.delete('/api/delete_user')
def delete_user(response: Response, request: Request, body = Body(...)):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

	identificadores = ['Nome', 'CPF']

	try:
		empresa = body['empresa']
		identificador = body['identificador']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}
	
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.delete_one(
			{"$or" : [{i: identificador} for i in identificadores]}
		)
		if result.deleted_count == 0:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}

		return body

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/upload_table')
async def add_table(request: Request, response: Response):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

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
			"message": "Identificadores duplicados na tabela",
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

@app.get('/api/table')
def download_table(request: Request, response: Response, empresa: str):
	verified, message = check_token(request)
	if not verified:
		response.status_code = 401
		return {"message": message}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["planos_usuarios"]
		usuarios_info = usuarios_db[empresa]

		result = usuarios_info.find({}, {"_id": 0})
		if not result:
			response.status_code = 404
			return {"message": "Tabela vazia"}

		df = pd.DataFrame(list(result))
		print(df)
		df.to_csv('tabela_usuario.csv', sep=',', index=False)
		return FileResponse('tabela_usuario.csv', filename='tabela_usuario.csv')

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/signup')
def create_new_empresa(response: Response, body: dict = Body(...)):
	try:
		empresa = body['empresa']
		senha = body['senha']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	salt = bcrypt.gensalt()
	hashed = bcrypt.hashpw(senha.encode('utf8'), salt)
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["logins"]
		usuarios_info = usuarios_db['login_info']

		result = usuarios_info.find_one({'empresa': empresa})
		if result is not None:
			response.status_code = 409
			return {"message": "Empresa já possui login"}
		
		result = usuarios_info.insert_one({'empresa': empresa, 'senha': hashed})

		token = jwt.encode(
			{'empresa': empresa, 'senha': senha},
			JWT_SECRET,
			algorithm="HS256"
		)

		return {"message": "Login criado com sucesso", 'empresa': empresa, 'token': token}

	except BaseException as e:
		print(e)
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@app.post('/api/login')
def empresa_login(response: Response, body: dict = Body(...)):
	try:
		empresa = body['empresa']
		senha = body['senha']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client["logins"]
		usuarios_info = usuarios_db['login_info']

		result = usuarios_info.find_one({'empresa': empresa})
		if result is None:
			response.status_code = 401
			return {"message": "Usuário ou senha incorretos"}
		
		if not bcrypt.checkpw(senha.encode('utf8'), result['senha']):
			response.status_code = 401
			return {"message": "Usuário ou senha incorretos"}

		token = jwt.encode(
			{'empresa': empresa, 'senha': senha},
			JWT_SECRET,
			algorithm="HS256"
		)
		
		return {"message": "Login efetuado com sucesso", 'empresa': empresa, 'token': token}

	except BaseException as e:
		print(e)
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}