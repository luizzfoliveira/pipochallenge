from email import header
import requests

access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbXByZXNhIjoiRmVsaXBlIiwic2VuaGEiOiJzZW5oYSJ9.M-Ze3eM515UTQmi46y8wZdg8vyl4QfPDsvalDWsEzRI"

DBHOST = 'localhost'
BASE_URL = f'http://{DBHOST}:8000'

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
	print(response.json())
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

	assert r.status_code == 422 and 'message' in r.json().keys()\
		and r.json()['message'] == "Dados conflitantes"

def test_adc_usuario_com_info_certa():
	url = f'{BASE_URL}/api/usuarios/update'

	values = {
		'empresa': 'Teste',
		'info': {'Nome': 'Luiz', 'CPF': '037', 'Altura (cm)': 177}
	}

	r = requests.patch(url, json=values, headers=header)

	assert r.status_code == 200
