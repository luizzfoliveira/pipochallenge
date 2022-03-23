from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pymongo

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
def get_necessary_info(planos: str):
	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	planos_db = client["planos"]
	planos_info = planos_db['planos_info']

	planos_list = planos.split('/')
	result = planos_info.find({"plano" : {"$in": planos_list}})
	result_list = [r['info'] for r in result]

	necessary_info = set().union(*result_list)

	return {'info': necessary_info}

@app.post('/api/info')
def set_new_info(plano: str, info: str):
	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	planos_db = client["planos"]
	planos_info = planos_db['planos_info']

	result = planos_info.insert_one({"plano": plano, "info": info.split('/')})

	return {'mensagem': 'Plano adicionado com sucesso'}

@app.get('/api/planos')
def get_planos():
	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	planos_db = client["planos"]
	planos_info = planos_db['planos_info']

	result = planos_info.find()

	return {"planos": [r['plano'] for r in result]}
