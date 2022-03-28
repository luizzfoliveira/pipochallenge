# O problema

Muitas vezes, o gerenciamento das informações de funcionários de uma empresa se torna complicado pela falta de centralização e de verificação de informações. Por ser um processo mecânico, muitas vezes há erros, como por exemplo a inserção de informações conflitantes para um mesmo funcionário (Ex.: um dígito errado num CPF, escrita errada do nome, etc.), além de ser um processo cansativo. Muitas vezes é necessário que se preencha a mesma informação em mais de um formulário para diferentes planos.

# A solução

Um software que consegue gerenciar essas informações de maneira simples e sempre verificando se há conflito. Além de gerenciar as informações, é necessário fornecer uma interface simples de ser utilizada. Este projeto foi feito para isso. Ele fornece uma interface simples, em que uma empresa pode gerir as informações de seus funcionários de forma simplificada, sempre confiando de que não será inserida informação conflitante.

# O produto

O backend foi desenvolvido em Python, utilizando FastAPI, fazendo a comunicação com um banco de dados MongoDB. O frontend foi feito em ReactJS.

A página inicial é uma interface simples que apresenta somente os planos cadastrados no sistema e possibilita que o usuário entre na área específica de sua empresa, efetuando login. Na área da empresa, deve-se cadastrar quais planos, dos possíveis, a empresa contratou.

É possível inicializar o banco de dados a partir da planilha que a empresa utiliza, no momento, para gerenciar essas informações. Basta ir à aba "Inicializar" e subir a tabela como um arquivo CSV. Caso haja identificadores repetidos, o aplicativo não inicializa o banco de dados e informa quais identificadores foram repetidos.

Depois disso, caso queira adicionar um novo funcionário, basta ir para a aba "Novo" e escolher quais planos deseja adicionar, além de fornecer um identificador para o usuário (CPF ou Nome). Com essa informação, o aplicativo informa se é um usuário já existente, caso não seja, basta adicionar as informações do usuário para os planos escolhidos. Caso seja um usuário existente e deseja-se adicionar um novo plano para esse usuário, basta ir para a aba "Update" e informar qual(is) plano(s) deseja(m)-se acrescentar e para qual funcionário. Neste caso, para evitar conflitos de informações, somente as informações que não se tem do usuário que serão editáveis.

Para casos de erros no primeiro registro do usuário, é possível ir para a aba "Alterar" para alterar informações do usuário. Além disso, também é possível deletar um usuário, na aba "Deletar"

Por fim, caso queira as informações alteradas do banco de dados em uma tabela novamente, basta clicar na aba "Baixar" que será feito o download do banco de dados de funcionários em um arquivo CSV.

# Como rodar

Basta baixar este repositório e, possuindo docker e docker-compose instalados, buildar e rodar as imagens. Porém, deve passar uma chave secreta para o gerador de JWT.

```sh
git clone https://github.com/luizzfoliveira/pipochallenge /path/to/rep
cd /path/to/rep
export JWT_SECRET="SUPER_SECRET"
docker-compose build
docker-compose up
```

Caso queira rodar o programa na própria máquina, deve-se inicializar um MongoDB e exportar seu host e sua porta, antes de rodar o servidor de backend. Então, basta rodar o servidor de backend e o de frontend.

```sh
git clone https://github.com/luizzfoliveira/pipochallenge /path/to/rep
cd /path/to/rep
```

```sh
cd backend
pip install requirements.txt
uvicorn main:app
```

```sh
cd frontend
npm install
npm start
```

# As rotas de backend

No backend, foram feitas diversas rotas para tratar as informações necessárias.

## Autenticação

O servidor utiliza de autenticação com JWT, sendo que ele é fornecido sempre que há um login ou um signup. Esse token deve ser passado como "Bearer Token" em todas as rotas de funcionários, planos e tabela.

## Funcionários

Essas rotas fornecem as opções de gestão das informações de usuários.

### GET

#### /api/usuarios

Deve-se passar o nome da empresa e o identificador (Nome ou CPF) do funcionário como querys. Então, caso encontre esse funcionário nessa empresa, o servidor responde com todas as informações do usuário.

### POST

#### /api/usuarios/novo

Esta rota verifica se o funcionário já existe, a partir de seu identificador e, caso não exista, adiciona esse funcionário ao banco de dados. É necessário passar a informação do usuário e o nome da empresa no corpo do request.
Ex.:

```
{
	info: {
		Planos: ["Norte Europa"]
		Nome: "Coiote",
		CPF: "000.000.000-01",
		Data Admissão: "1949",
		Email: "wiliee.coyote@acme.co"
	}
	empresa: "Acme Co"
}
```

### PATCH

#### /api/usuarios/update

Esta rota acrescenta novas informações ao usuário, verificando se foi passada alguma informação conflitante. O corpo deve ser passado como no caso anterior. Vale lembrar que as rotas de PATCH não precisam informar novamente informações que já estejam no banco de dados, por isso foi possível emitir o CPF no exemplo.
Ex.:

```
{
	info: {
		Planos: ["Dental Sorriso"]
		Nome: "Coiote",
		Peso (kg): "6",
		Altura (cm): "170"
	}
	empresa: "Acme Co"
}
```

#### /api/usuarios/alterar

Esta rota garante a possibilidade de consertar alguma informação errada, que tenha sido colocada pela primeira vez. No caso anterior, era para passar 60 kg como peso, o que será corrigido nesta rota.
Ex.:

```
{
	info: {
		Nome: "Coiote",
		Peso (kg): "60",
	}
	empresa: "Acme Co"
}
```

### DELETE

#### /api/usuarios/delete_plano

Esta rota deleta um(ns) plano(s) da coluna "Planos" de um funcionário. Basta fornecer o nome da empresa, um identificador do funcionáro e o(s) nome(s) do(s) plano(s).

```
{
	identificador: "000.000.000-01" (ou "Coiote")
	empresa: "Acme Co"
	planos: ["Dental Sorriso", "Norte Europa"]
}
```

#### /api/usuarios/deletar

Esta rota deleta completamente um funcionário do banco de dados, caso o funcionário saia da empresa. Basta passar o nome da empresa e um identificador do usuário para deletá-lo.
Ex.:

```
{
	identificador: "000.000.000-01" (ou "Coiote")
	empresa: "Acme Co"
}
```
