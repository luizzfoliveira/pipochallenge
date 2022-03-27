from fastapi import Body, Response, APIRouter
import pymongo
from .utils.utils import DBHOST, DBPORT, JWT_SECRET
import jwt
import bcrypt

router = APIRouter(
	prefix="/api",
	tags=["login"]
)

@router.post('/login')
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

@router.post('/signup')
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
