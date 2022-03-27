# Acrescentar as informações de planos que já são fornecidas

from routers.utils.utils import DBHOST, DBPORT
import pymongo

planos_originais = [
	
	{
		"plano": "Norte Europa",
		"info": ["Nome", "CPF", "Data Admissão", "Email"]
	},
	{
		"plano": "Pampulha Intermédica",
		"info": ["Nome", "CPF", "Data Admissão", "Endereço"]
	},
	{
		"plano": "Dental Sorriso",
		"info": ["Nome", "CPF", "Peso (kg)", "Altura (cm)"]
	},
	{
		"plano": "Mente Sã, Corpo São",
		"info": ["CPF", "Horas meditadas nos últimos 7 dias"]
	}
]

try:
	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	planos_db = client["planos"]
	planos_info = planos_db['planos_info']

	planos_info.drop()
	planos_info.insert_many(planos_originais)

except:
	print("Erro ao conectar ao banco de dados")