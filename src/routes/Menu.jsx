import React, { useState } from 'react';
import '../assets/styles/menu.css';
import { API_URL } from '../auth/constants';

const Menu = () => {
    const [textareaValue, setTextareaValue] = useState('');
    const [functionality, setFunctionality] = useState('');
    const [functionalityText, setFunctionalityText] = useState('');
    const [typeMethod, setType] = useState('');
    const [typeFile, setTypeFile] = useState('');
    const [result, setResult] = useState('');
    const [tokens, setTokens] = useState([]);
    const [tokensCount, setTokensCount] = useState({})
    const [resultDocs, setResultDocs] = useState([])

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        setTextareaValue(value);
        updateFunctionalityText(value);
    };

    const handleButtonClick = (text, functionalityType, type, typeFiledb) => {
        setTextareaValue(text);
        setFunctionality(functionalityType);
        updateFunctionalityText(text, functionalityType);
        setType(type)
        setTypeFile(typeFiledb)
    };

    const extractDocumentProperties = (text) => {
        const documentMatch = text.match(/{.*?}/);
        if (documentMatch) {
            try {
                const document = JSON.parse(documentMatch[0]);
                const formattedDocument = Object.entries(document)
                    .map(([key, value]) => `<span class="highlight-property">"${key}"</span> : <span class="highlight-value">"${value}"</span>`)
                    .join(', ');
                return formattedDocument;
            } catch (error) {
                console.error('Invalid JSON format', error);
            }
        }
        return '';
    };

    const extractConditionProperties = (text) => {
        const conditionMatch = text.match(/WHERE \{.*?\}/);
        if (conditionMatch) {
            try {
                const condition = JSON.parse(conditionMatch[0].replace('WHERE ', ''));
                const formattedCondition = Object.entries(condition)
                    .map(([key, value]) => `<span class="highlight-property">"${key}"</span> : <span class="highlight-value">"${value}"</span>`)
                    .join(', ');
                return formattedCondition;
            } catch (error) {
                console.error('Invalid JSON format in condition', error);
            }
        }
        return '';
    };

    const updateFunctionalityText = (text, functionalityType = functionality) => {
        const dbMatch = text.match(/DATABASE (\w+)/);
        const collectionMatch = text.match(/COLLECTION (\w+)/);

        const dbName = dbMatch ? dbMatch[1] : 'nombre_db';
        const collectionName = collectionMatch ? collectionMatch[1] : 'nombre_colección';
        const documentProperties = extractDocumentProperties(text);
        const conditionProperties = extractConditionProperties(text);

        let updatedText = '';

        switch (functionalityType) {
            case 'Crear Base de Datos':
                updatedText = `Crear la base de datos "<span class="highlight-db">${dbName}</span>" con la colección "<span class="highlight-collection">${collectionName}</span>"`;
                break;
            case 'Crear Colección':
                updatedText = `Crear la colección "<span class="highlight-collection">${collectionName}</span>" en la base de datos "<span class="highlight-db">${dbName}</span>"`;
                break;
            case 'Insertar Documento':
                updatedText = `Insertar un documento con las propiedades y valores: ${documentProperties} en la base de datos "<span class="highlight-db">${dbName}</span>" en la colección "<span class="highlight-collection">${collectionName}</span>"`;
                break;
            case 'Obtener Documentos':
                updatedText = `Obtener documentos de la base de datos "<span class="highlight-db">${dbName}</span>" en la colección "<span class="highlight-collection">${collectionName}</span>"`;
                break;
            case 'Actualizar Documento':
                updatedText = `Actualizar el documento con los valores ${documentProperties} que coincida con ${conditionProperties} en la colección "<span class="highlight-collection">${collectionName}</span>" de la base de datos "<span class="highlight-db">${dbName}</span>"`;
                break;
            case 'Eliminar Documento':
                updatedText = `Eliminar un documento de la base de datos "<span class="highlight-db">${dbName}</span>" en la colección "<span class="highlight-collection">${collectionName}</span>" donde coincida con ${conditionProperties}`;
                break;
            case 'Eliminar Colección':
                updatedText = `Eliminar la colección "<span class="highlight-collection">${collectionName}</span>" de la base de datos "<span class="highlight-db">${dbName}</span>"`;
                break;
            default:
                updatedText = '';
        }

        setFunctionalityText(updatedText);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        let method = 'POST';
        switch (typeMethod) {
            case 'create':
                method = 'POST'
                break;
            case 'get':
                method = 'POST'
                break;
            case 'update':
                method = 'PUT'
                break;
            case 'delete':
                method = 'DELETE'
                break;
            default:
                method = 'GET'
                break;
        }

        console.log(`${API_URL}/${typeMethod}/${typeFile}`)

        try {
            const response = await fetch(`${API_URL}/${typeMethod}/${typeFile}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'statement': textareaValue
                })
            });


            if (response.ok) {
                const json = await response.json();
                if (typeMethod == 'get' && Array.isArray(json.message)) {
                    setResultDocs(json.message)
                    if (json.message.length === 0) {
                        setResult(json.message)
                    } else {
                        setResult("")
                    }
                } else {
                    setResult(json.message)
                }
                setTokens(json.tokens)
                setTokensCount(json.tokens_count)
                console.log(tokens)
                console.log(tokensCount)

            } else {
                const json = await response.json();
                setResult(json.message)
                setResultDocs([])
                setTokens(json.tokens)
                setTokensCount(json.tokens_count)
            }

        } catch (error) {
            setResultDocs([])
            console.log('Error: ', error);
        }
    }

    return (
        <div className="container container_menu">
            <div className="container_functions">
                <p dangerouslySetInnerHTML={{ __html: functionalityText }} />
                <textarea
                    name="code"
                    rows={5}
                    cols={50}
                    placeholder="Escribe aquí la sentencia"
                    value={textareaValue}
                    onChange={handleTextareaChange}
                />
                <div className="container_buttons">
                    <button
                        className='button_function create_db_button'
                        onClick={() => handleButtonClick('CREATE DATABASE nombre_db WITH COLLECTION nombre_colección', 'Crear Base de Datos', 'create', 'database')}
                    >
                        Crear Base de Datos
                    </button>
                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('CREATE COLLECTION nombre_colección INTO DATABASE nombre_db', 'Crear Colección', 'create', 'collection')}
                    >
                        Crear Colección
                    </button>

                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('INSERT {"Ejemplo": "ejemplo"} INTO DATABASE nombre_db COLLECTION nombre_colección ', 'Insertar Documento', 'create', 'document')}
                    >
                        Insertar Documento
                    </button>
                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('GET DOCUMENTS FROM DATABASE nombre_db COLLECTION nombre_colección', 'Obtener Documentos', 'get', 'documents')}
                    >
                        Obtener Documentos
                    </button>
                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('UPDATE {"Ejemplo": "ejemplo"} WHERE {"Ejemplo": "ejemplo"} INTO DATABASE nombre_db COLLECTION nombre_colección ', 'Actualizar Documento', 'update', 'document')}
                    >
                        Actualizar Documento
                    </button>
                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('DELETE {"Ejemplo": "Ejemplo"} FROM DATABASE nombre_db COLLECTION nombre_colección', 'Eliminar Documento', 'delete', 'document')}
                    >
                        Eliminar Documento
                    </button>
                    <button
                        className='button_function'
                        onClick={() => handleButtonClick('DELETE COLLECTION nombre_colección FROM DATABASE nombre_db', 'Eliminar Colección', 'delete', 'collection')}
                    >
                        Eliminar Colección
                    </button>
                    <button className='execute' onClick={handleSubmit}>
                        Ejecutar
                    </button>
                </div>
            </div>

            <div className="container_results">

                <div className="container_sintactic">
                    <p className='highlight-db'>Resultado</p>
                    <p>{result}</p>
                    {resultDocs.length > 0 && (
                        <ul>
                            {resultDocs.map((doc, index) => (
                                <li key={index}>
                                    {Object.entries(doc).map(([key, value]) => (
                                        <span key={key} className="highlight-property">
                                            "{key}": <span className="highlight-value">"{value}"</span>
                                        </span>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="container_lexical">
                    <p className='highlight-db'>Análisis Léxico</p>


                    <table>
                        <thead>
                            <tr>
                                <th>Tokens</th>
                                <th>PR</th>
                                <th>ID</th>
                                <th>Símbolos</th>
                                <th>Números</th>
                                <th>Cadenas</th>
                                <th>Boleanos</th>
                                <th>Nulo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tokens.map((token, index) => (
                                <tr key={index}>
                                    <td>
                                        {token.value === true ? 'true' :
                                            token.value === false ? 'false' :
                                                token.value === null ? 'null' :
                                                    token.value}
                                    </td>
                                    <td>{token.type === 'CREATE' || token.type === 'DATABASE' || token.type === 'WITH' || token.type === 'COLLECTION' || token.type === 'INSERT' || token.type === 'INTO' || token.type === 'GET' || token.type === 'DOCUMENTS' || token.type === 'FROM' || token.type === 'UPDATE' || token.type === 'SET' || token.type === 'WHERE' || token.type === 'DELETE' ? 'x' : ''}</td>
                                    <td>{token.type === 'IDENTIFIER' ? 'x' : ''}</td>
                                    <td>{token.type === 'LBRACE' || token.type === 'RBRACE' || token.type === 'COLON' || token.type === 'COMMA' ? 'x' : ''}</td>
                                    <td>{token.type === 'NUMBER' ? 'x' : ''}</td>
                                    <td>{token.type === 'STRING' ? 'x' : ''}</td>
                                    <td>{token.type === 'TRUE' || token.type == 'FALSE' ? 'x' : ''}</td>
                                    <td>{token.type === 'NULL' ? 'x' : ''}</td>
                                </tr>
                            ))}

                            <tr>
                                <td><strong>Total</strong></td>
                                <td>{tokensCount.PR}</td>
                                <td>{tokensCount.ID}</td>
                                <td>{tokensCount.SYM}</td>
                                <td>{tokensCount.NUMBER}</td>
                                <td>{tokensCount.STRING}</td>
                                <td>{tokensCount.BOOL}</td>
                                <td>{tokensCount.NULL}</td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default Menu;
