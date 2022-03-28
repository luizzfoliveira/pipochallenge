from email import header
import requests
import pymongo

access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbXByZXNhIjoiRmVsaXBlIiwic2VuaGEiOiJzZW5oYSJ9.M-Ze3eM515UTQmi46y8wZdg8vyl4QfPDsvalDWsEzRI"

DBHOST = 'localhost'
DBPORT = '27017'
BASE_URL = f'http://localhost:8000'

header = {'Authorization': f'Bearer {access_token}'}

def compare_lists(*args):
	for i in range(len(args)):
		args[i].sort()
	for i in range(len(args) - 1):
		if args[i] != args[i + 1]:
			return False
	return True

def test_acme_co():
	planos = ["Norte Europa", "Dental Sorriso"]
	response = requests.get(BASE_URL + '/api/info?planos=' + '/'.join(planos))

	info = response.json()['info']
	assert compare_lists(info, ["Nome", "CPF", "Data Admissão", "Email",
	"Peso (kg)", "Altura (cm)"])

def test_tio_patinhas_bank():
	planos = ['Pampulha Intermédica', 'Dental Sorriso', 'Mente Sã, Corpo São']
	response = requests.get(BASE_URL + '/api/info?planos=' + "/".join(planos))
	info = response.json()['info']
	assert compare_lists(info, ["Nome", "CPF", "Data Admissão", "Endereço",
	"Peso (kg)", "Altura (cm)", "Horas meditadas nos últimos 7 dias"])

def test_criar_novo_db_de_tabela_CSV():
	url = f'{BASE_URL}/api/tabela'

	files = {'base': open('teste.csv','rb')}
	values = {'empresa': 'Teste'}

	r = requests.post(url, files=files, data=values, headers=header)

	assert r.status_code == 200

def test_verificar_post_usuario_repetido():
	url = f'{BASE_URL}/api/usuarios/novo'

	values = {'empresa': 'Teste', 'info': {'Nome': 'Luiz', 'CPF': 'errado'}}

	r = requests.post(url, json=values, headers=header)

	assert r.status_code == 409

def test_adc_usuario_com_info_errada():
	url = f'{BASE_URL}/api/usuarios/update'

	values = {'empresa': 'Teste', 'info': {'Nome': 'Luiz', 'CPF': 'errado'}}

	r = requests.patch(url, json=values, headers=header)

	assert r.status_code == 409 and 'message' in r.json().keys()\
		and r.json()['message'] == "Dados conflitantes"

def test_adc_usuario_com_info_certa():
	url = f'{BASE_URL}/api/usuarios/update'

	values = {
		'empresa': 'Teste',
		'info': {
			'Nome': 'Luiz',
			'CPF': '037',
			'Altura (cm)': 177,
			'Planos': ["Plano Teste"]
		}
	}

	r = requests.patch(url, json=values, headers=header)

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["usuarios"]

	result = usuarios_info.find_one(
		{"Nome": "Luiz"},
		{'_id': 0}
	)

	assert result is not None and result["Altura (cm)"] == 177

def test_alterar_usuario():
	url = f'{BASE_URL}/api/usuarios/alterar'

	values = {
		'empresa': 'Teste',
		'info': {'CPF': '037', 'Altura (cm)': 10}
	}

	r = requests.patch(url, json=values, headers=header)

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["usuarios"]

	result = usuarios_info.find_one(
		{"Nome": "Luiz"},
		{'_id': 0}
	)

	assert result is not None and result["Altura (cm)"] == 10

def test_deletar_plano_usuario():
	url = f'{BASE_URL}/api/usuarios/delete_plano'

	values = {
		'empresa': 'Teste',
		'identificador': "037",
		'planos': ['Plano Teste']
	}

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["usuarios"]

	result = usuarios_info.find_one(
		{"Nome": "Luiz"},
		{'_id': 0}
	)

	assert result is not None and result["Planos"] == ["Plano Teste"]

	r = requests.delete(url, json=values, headers=header)

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["usuarios"]

	result = usuarios_info.find_one(
		{"Nome": "Luiz"},
		{'_id': 0}
	)

	assert result is not None and not result["Planos"]

def test_deletar_usuario():
	url = f'{BASE_URL}/api/usuarios/deletar'

	values = {
		'empresa': 'Teste',
		'identificador': "037"
	}

	r = requests.delete(url, json=values, headers=header)

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["usuarios"]

	result = usuarios_info.find_one(
		{"Nome": "Luiz"},
		{'_id': 0}
	)

	assert result is None

def test_adicionar_plano():
	url = f'{BASE_URL}/api/empresa/planos'

	values = {
		'empresa': 'Teste',
		'planos': ["Plano Teste2"]
	}

	r = requests.post(url, json=values, headers=header)

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["planos"]

	result = usuarios_info.find_one(
		{"Nome": "Plano Teste2"},
		{'_id': 0}
	)

	assert result is not None

def test_ver_planos():
	url = f'{BASE_URL}/api/empresa/planos?empresa=Teste'

	r = requests.get(url, headers=header)

	
	assert r.status_code == 200 and r.json()['planos'] == ['Plano Teste2']

def test_del_plano():
	url = f'{BASE_URL}/api/empresa/planos'

	values = {
		'empresa': 'Teste',
		'planos': ["Plano Teste2"]
	}

	client = pymongo.MongoClient(f"mongodb://{DBHOST}:{DBPORT}/")
	usuarios_db = client["Teste"]
	usuarios_info = usuarios_db["planos"]

	result = usuarios_info.find_one(
		{"Nome": "Plano Teste2"},
		{'_id': 0}
	)

	assert result is not None

	r = requests.delete(url, json=values, headers=header)

	result = usuarios_info.find_one(
		{"Nome": "Plano Teste2"},
		{'_id': 0}
	)

	assert result is None
