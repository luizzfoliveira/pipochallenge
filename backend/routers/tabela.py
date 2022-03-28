from fastapi import Request, Response, APIRouter, Depends
from fastapi.responses import FileResponse
import pymongo
from .utils.utils import check_token, DBHOST, DBPORT, identificadores
import functools
import pandas as pd
import shutil
import re

router = APIRouter(
	prefix="/api/tabela",
	tags=["tabela"],
	dependencies=[Depends(check_token)]
)

@router.get('/')
def download_table(response: Response, empresa: str):
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

		result = usuarios_info.find({}, {"_id": 0})
		if not result:
			response.status_code = 404
			return {"message": "Tabela vazia"}

		df = pd.DataFrame(list(result))

		df.to_csv('tabela_usuario.csv', sep=',', index=False)
		return FileResponse('tabela_usuario.csv', filename='tabela_usuario.csv')

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@router.post('/')
async def add_table(request: Request, response: Response):
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

	if "Planos" in df.columns:
		df['Planos'] = df.Planos.apply(
			lambda x: [i.strip() for i in 
			re.split(r',(?=([^\"\']*[\"\'][^\"\']*[\"\'])*[^\"\']*$)', x) if i is not None]
		)

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
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

		usuarios_info.drop()

		usuarios_info.insert_many(df.to_dict('records'))

		return {"message": "Banco de dados criado com sucesso"}

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}
