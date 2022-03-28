from fastapi import Body, Depends, FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import pymongo
from routers import planos
from routers.utils.utils import check_token, DBHOST, DBPORT
from routers import usuarios, tabela, login

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
app.include_router(usuarios.router)
app.include_router(planos.router)
app.include_router(tabela.router)
app.include_router(login.router)

@app.get('/api/info')
def get_necessary_info(response: Response, planos: str, request: Request):
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

@app.post('/api/info', dependencies=[Depends(check_token)])
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
