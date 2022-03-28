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
		Planos: ["Norte Europa"],
		Nome: "Coiote",
		CPF: "000.000.000-01",
		Data Admissão: "1949",
		Email: "wiliee.coyote@acme.co"
	},
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
		Planos: ["Dental Sorriso"],
		Nome: "Coiote",
		Peso (kg): "6",
		Altura (cm): "170"
	},
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
	},
	empresa: "Acme Co"
}
```

### DELETE

#### /api/usuarios/delete_plano

Esta rota deleta um(ns) plano(s) da coluna "Planos" de um funcionário. Basta fornecer o nome da empresa, um identificador do funcionáro e o(s) nome(s) do(s) plano(s).

```
{
	identificador: "000.000.000-01" (ou "Coiote"),
	empresa: "Acme Co",
	planos: ["Dental Sorriso", "Norte Europa"]
}
```

#### /api/usuarios/deletar

Esta rota deleta completamente um funcionário do banco de dados, caso o funcionário saia da empresa. Basta passar o nome da empresa e um identificador do usuário para deletá-lo.
Ex.:

```
{
	identificador: "000.000.000-01" (ou "Coiote"),
	empresa: "Acme Co"
}
```

## Tabela

Essas rotas facilitam a visualização e criação do banco de dados pelo usuário. Antes de utilizar este programa, provavelmente as informações dos funcionários estavam sendo guardadas em planilhas (Excel, Google Docs, etc.). Por isso, essa integração passa a ser necessária.

### GET

#### /api/tabela

Esta rota fornece todo o banco de dados como uma tabela CSV. Basta informar, por uma query, o nome da empresa ("?empresa=...").

### POST

#### /api/post

Esta rota facilita a inicialização do banco de dados pelo usuário. Basta fornecer o arquivo com nome "base" e o nome da empresa. É necessário exportar a tabela do Excel ou Google Docs ou outra plataforma, como um arquivo CSV separado por vírgulas.Então, é criado um banco de dados com o nome da empresa e uma coleção "usuarios" com as informações passadas pela tabela.

## Planos

Essas rotas fornecem o gerenciamento de quais planos uma empresa contrata.

### GET

#### /api/empresa/planos

Esta rota fornece todos os planos de uma empresa especificada como query ("?empresa=...").

### POST

#### /api/empresa/planos

Esta rota possibilita adicionar novos planos para uma empresa. Basta fornecer quais planos se deseja adicionar e o nome da empresa no corpo do pedido.
Ex.:

```
{
	planos: ["Pampulha Intermédica", "Dental Sorriso", "Mente Sã, Corpo São", "Norte Europa"],
	empresa: "Tio Patinhas Bank"
}
```

### DELETE

#### /api/empresa/planos

Esta rota deleta planos de uma empresa. O corpo é similar ao do item anterior
Ex.:

```
{
	planos: ["Norte Europa"],
	empresa: "Tio Patinhas Bank"
}
```

## LOGIN

Estas rotas possibilitam a criação de novos usuários para gerenciamento de informações da empresa. Elas retornam um JWT para ser utilizado nas chamadas ao servidor que utilizam autenticação. Por isso, estas rotas não necessitam de autenticação

### POST

#### /api/signup

Esta rota cria um novo usuário no banco de dados, retornando o JWT que esse usuário deve utilizar, sempre que for fazer alguma chamada ao servidor que necessite de autenticação. No corpo basta passar o nome da empresa e a senha.
Ex.:

```
{
	senha: "senha secreta",
	empresa: "Tio Patinhas Bank"
}
```

#### /api/login

Para usuários já cadastrados ao banco de dados, é possível fazer um login para receber o JWT. O servidor compara a senha passada à que está no banco de dados e valida ou não o login do usuário. O corpo é similar ao exemplo anterior.
Ex.:

```
{
	senha: "senha secreta",
	empresa: "Tio Patinhas Bank"
}
```

## Rotas Genéricas

Além das rotas apresentadas anteriormente, há três outras rotas genéricas. Essas rotas são para pesquisar quais as informações serão necessárias para cadastrar um novo funcionário, dado planos específicos. Elas também retornam todos os planos cadastrados no banco de dados e adicionam planos ao banco de dados.

### GET

#### /api/planos

Esta rota não necessita de parâmetros nem de JWT. Ela simplesmente retorna todos os planos cadastrados no banco de dados.

#### /api/info

Esta rota pesquisa por planos passados como uma query, sem necessidade de JWT. Os planos devem ser separados por uma barra para evitar erros com vírgulas (?planos=P1/P2/...). Ela retorna todas as informações necessárias para cadastrar um funcionário em todos os planos fornecidos. Em casos de dois ou mais planos precisarem da mesma informação, essa informação é retornada uma única vez ao usuário, para evitar repetições.

### POST

#### /api/info

Esta rota adiciona novos planos ao banco de dados, sendo necessário fornecer um JWT válido para acessar essa rota. Para adicionar novas informações ao banco, basta fornecer o nome do plano e quais informações esse plano necessita no corpo do request.
Ex.:

```
{
	plano: "Novo Plano",
	info: ["Nome", ...]
}
```
