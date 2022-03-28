from fastapi import Body, Response, APIRouter, Depends
import pymongo
from .utils.utils import check_token, DBHOST, DBPORT
import re

router = APIRouter(
	prefix="/api/empresa/planos",
	tags=["planos"],
	dependencies=[Depends(check_token)]
)

@router.get('/')
def get_planos_empresa(response: Response, empresa: str):
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client[empresa.replace(" ", "_")]
		planos_info = planos_db["planos"]

		result = planos_info.find()

		return {"planos": [r['Nome'] for r in result]}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@router.post('/')
def get_planos_empresa(response: Response, body = Body(...)):
	try:
		planos = body['planos']
		empresa = body['empresa'].replace(" ", "_")
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	if not isinstance(planos, list):
		planos = [p.strip().strip('"').strip("'") for p in
		re.split(r',(?=([^\"\']*[\"\'][^\"\']*[\"\'])*[^\"\']*$)', planos) if p is not None]

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client[empresa]
		planos_info = planos_db["planos"]

		result = planos_info.find_one(
			{"Nome" : {"$in": planos}},
		)
		if result is not None:
			response.status_code = 409
			return {"message": f"Plano '{result['Nome']}' já está no banco de dados"}

		result = planos_info.insert_many([{'Nome': x} for x in planos])

		return {"message": "Plano(s) adicionado(s) com sucesso"}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}

@router.delete('/')
def get_planos_empresa(response: Response, body = Body(...)):
	try:
		planos = body['planos']
		empresa = body['empresa'].replace(" ", "_")
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	if isinstance(planos, str):
		planos = [p.strip().strip('"').strip("'") for p in
		re.split(r',(?=([^\"\']*[\"\'][^\"\']*[\"\'])*[^\"\']*$)', planos) if p is not None]

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		planos_db = client[empresa]
		planos_info = planos_db["planos"]

		result = planos_info.delete_many({"Nome" : {"$in": planos}})
		if result.deleted_count == 0:
			response.status_code = 404
			return {"message": "Plano(s) não encontrado(s)"}

		return {"message": f"Plano(s) deletado(s) com sucesso"}
	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}