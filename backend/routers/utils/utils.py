from fastapi import HTTPException, Request
import jwt
from os import getenv

DBPORT = '27017'
DBHOST = 'localhost'

JWT_SECRET = getenv('JWT_SECRET')

identificadores = ['Nome', 'CPF']

def check_jwt(token: str) -> bool:
	try:
		jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
		return True
	except:
		return False

def check_token(request: Request):
	header = request.headers
	try:
		token = header['authorization']
	except:
		raise HTTPException(status_code=401, detail="Falta token de acesso")
	temp = token.split()
	if temp[0] != 'Bearer':
		raise HTTPException(status_code=401, detail="Falta token de acesso")
	if not check_jwt(temp[1]):
		raise HTTPException(status_code=401, detail="Não autorizado")