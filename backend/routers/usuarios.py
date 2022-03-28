from fastapi import Body, Response, APIRouter, Depends
import pymongo
from .utils.utils import check_token, DBHOST, DBPORT, identificadores

router = APIRouter(
	prefix="/api/usuarios",
	tags=["beneficiarios"],
	dependencies=[Depends(check_token)]
)

@router.get('/')
def get_user_info(response: Response, ident: str, empresa: str):
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

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

@router.post('/novo')
def set_new_user(response: Response, body = Body(...)):
	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

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

@router.patch('/update')
def add_plano_user(response: Response, body = Body(...)):
	print(body)
	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

		result = usuarios_info.find_one(
			{"$or": [{x: info[x]} for x in identificadores if x in info.keys()]}
		)
		if result is None:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}
		
		if "Planos" in result.keys() and 'Planos' in info.keys():
			info['Planos'].extend(result['Planos'])
			info['Planos'] = list(set(info['Planos']))

		for key in result.keys():
			if key != 'Planos' and key in info.keys() and info[key] != result[key]:
				response.status_code = 409
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

@router.patch('/alterar')
def change_user_info(response: Response, body: dict = Body(...)):
	# Verificação se a sintaxe do request está correta
	try:
		info = body['info']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

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

@router.delete('/deletar')
def delete_user(response: Response, body = Body(...)):
	try:
		empresa = body['empresa']
		identificador = body['identificador']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}
	
	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

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

@router.delete('/delete_plano')
def delete_plano_from_user(response: Response, body: dict = Body(...)):
	# Verificação se a sintaxe do request está correta
	print(body)
	try:
		ident = body['identificador']
		planos = body['planos']
		empresa = body['empresa']
	except:
		response.status_code = 400
		return {"message": "Informações faltando"}

	try:
		client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
		usuarios_db = client[empresa]
		usuarios_info = usuarios_db["usuarios"]

		ori_info = usuarios_info.find_one(
			{"$or": [{x: ident} for x in identificadores]}
		)
		if ori_info is None:
			response.status_code = 404
			return {"message": "Usuário não encontrado"}
		if 'Planos' not in ori_info.keys():
			response.status_code = 422
			return {"message": "Usuário não possui nenhum plano"}
		
		print(planos)
		novos_planos = [x for x in ori_info['Planos'] if x not in planos]
		print(novos_planos)
		usuarios_info.update_one(
			{"$or": [{x: ident} for x in identificadores]},
			{"$set": {"Planos": novos_planos}}
		)

		return body

	except:
		response.status_code = 500
		return {"message": "Erro ao conectar ao banco de dados"}
