import requests

DBHOST = 'localhost'
BASE_URL = f'http://{DBHOST}:8000'

def compare_lists(*args):
	for i in range(len(args)):
		args[i].sort()
	for i in range(len(args) - 1):
		if args[i] != args[i + 1]:
			return False
	return True

def test_acme_co():
	planos = ["Norte Europa", "Dental Sorriso"]
	response = requests.get(BASE_URL + '/info?planos=' + "/".join(planos))
	info = response.json()['info']
	assert compare_lists(info, ["Nome", "CPF", "Data Admissão", "Email",
	"Peso (kg)", "Altura (cm)"])

def test_tio_patinhas_bank():
	planos = ['Pampulha Intermédica', 'Dental Sorriso', 'Mente Sã, Corpo São']
	response = requests.get(BASE_URL + '/info?planos=' + "/".join(planos))
	info = response.json()['info']
	assert compare_lists(info, ["Nome", "CPF", "Data Admissão", "Endereço",
	"Peso (kg)", "Altura (cm)", "Horas meditadas nos últimos 7 dias"])
