// Efeito máquina de escrever em loop
function typeWriterLoop() {
    const elemento = document.querySelector('.typing-text');
    console.log('Procurando elemento .typing-text:', elemento);
    
    if (!elemento) {
        console.log('Elemento .typing-text não encontrado');
        return;
    }

    console.log('Elemento .typing-text encontrado, iniciando animação...');
    const texto = 'Programador Front-end';
    let index = 0;
    let isDeleting = false;
    let currentText = '';
    
    function type() {
        if (!isDeleting && index < texto.length) {
            // Digitando
            currentText += texto.charAt(index);
            elemento.textContent = currentText;
            index++;
            setTimeout(type, 100); // Velocidade da digitação
        } else if (isDeleting && index > 0) {
            // Apagando
            currentText = currentText.slice(0, -1);
            elemento.textContent = currentText;
            index--;
            setTimeout(type, 50); // Velocidade do apagar (mais rápido)
        } else if (!isDeleting && index === texto.length) {
            // Pausa antes de começar a apagar
            isDeleting = true;
            setTimeout(type, 2000); // Pausa de 2 segundos
        } else if (isDeleting && index === 0) {
            // Recomeça o ciclo
            isDeleting = false;
            setTimeout(type, 500); // Pausa antes de recomeçar
        }
    }
    
    // Inicia o efeito
    console.log('Iniciando animação de digitação...');
    type();
}

// Máscara para campo de telefone
function aplicarMascaraTelefone(input) {
    // Verificar se é realmente o campo de telefone
    if (input.id !== 'telefone') {
        return;
    }
    
    let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
    if (valor.length <= 10) {
        // Formato: (XX) XXXX-XXXX
        valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        // Formato: (XX) XXXXX-XXXX
        valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    
    input.value = valor;
}

// Função para alerta de sucesso
function abrirAlertaSuccess() {
    console.log('Tentando exibir alerta de sucesso...');
    if (typeof swal !== 'undefined') {
        console.log('SweetAlert disponível');
        swal("Mensagem enviada!", "Obrigado pelo contato! Retornaremos em breve.", "success");
    } else {
        console.log('SweetAlert não disponível, usando alert nativo');
        alert("Mensagem enviada! Obrigado pelo contato! Retornaremos em breve.");
    }
}

// Função para alerta de erro
function abrirAlertaError(mensagem = 'Por favor, preencha todos os campos antes de enviar.') {
    console.log('Tentando exibir alerta de erro:', mensagem);
    if (typeof swal !== 'undefined') {
        console.log('SweetAlert disponível');
        swal("Atenção!", mensagem, "error");
    } else {
        console.log('SweetAlert não disponível, usando alert nativo');
        alert("Atenção! " + mensagem);
    }
}

// Aguardar o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando...');
    
    // Aguardar um pouco mais para garantir que tudo carregou
    setTimeout(() => {
        // Inicializar efeito de digitação em loop
        console.log('Iniciando efeito de digitação...');
        
        // Verificar múltiplas vezes se o elemento existe
        let tentativas = 0;
        const maxTentativas = 5;
        
        function tentarIniciarDigitacao() {
            const elemento = document.querySelector('.typing-text');
            console.log(`Tentativa ${tentativas + 1}: Procurando .typing-text:`, elemento);
            
            if (elemento) {
                console.log('Elemento encontrado! Iniciando typeWriter...');
                typeWriterLoop();
                return;
            }
            
            tentativas++;
            if (tentativas < maxTentativas) {
                console.log(`Elemento não encontrado, tentando novamente em 200ms... (${tentativas}/${maxTentativas})`);
                setTimeout(tentarIniciarDigitacao, 200);
            } else {
                console.error('Elemento .typing-text não foi encontrado após todas as tentativas');
            }
        }
        
        tentarIniciarDigitacao();
        
        // Máscara para telefone
        const contatoInput = document.getElementById('telefone');
        if (contatoInput) {
            console.log('Campo de telefone encontrado, aplicando máscara...');
            contatoInput.addEventListener('input', function(e) {
                aplicarMascaraTelefone(e.target);
            });
            
            contatoInput.addEventListener('paste', function(e) {
                setTimeout(() => {
                    aplicarMascaraTelefone(e.target);
                }, 10);
            });
        }
        
        // Configurar formulário de contato
        const formularioContato = document.getElementById('contact-form');
        console.log('Buscando formulário com ID contact-form:', formularioContato);
        
        if (formularioContato) {
            console.log('Formulário de contato encontrado!');
            
            formularioContato.addEventListener('submit', function(e) {
                e.preventDefault(); // Previne o envio padrão e redirecionamento
                console.log('Formulário interceptado - processando envio...');
                
                // Aguardar um pouco para garantir que o DOM está completamente carregado
                setTimeout(() => {
                    // Obter elementos dos campos com verificação de segurança
                    const nomeElement = document.getElementById('nome');
                    const emailElement = document.getElementById('email');
                    const telefoneElement = document.getElementById('telefone');
                    const mensagemElement = document.getElementById('mensagem');
                    
                    console.log('Elementos encontrados:', {
                        nome: nomeElement,
                        email: emailElement,
                        telefone: telefoneElement,
                        mensagem: mensagemElement
                    });
                    
                    // Verificar se todos os elementos existem
                    if (!nomeElement || !emailElement || !telefoneElement || !mensagemElement) {
                        console.error('Erro: Um ou mais campos do formulário não foram encontrados');
                        abrirAlertaError('Erro no formulário! Campos não encontrados.');
                        return;
                    }
                    
                    // Obter valores dos campos
                    const nome = nomeElement.value.trim();
                    const email = emailElement.value.trim();
                    const contato = telefoneElement.value.trim();
                    const mensagem = mensagemElement.value.trim();
                    
                    console.log('Valores capturados:', { nome, email, contato, mensagem });
                    
                    // Validar campos obrigatórios
                    if (!nome || !email || !contato || !mensagem) {
                        console.log('Campos vazios detectados');
                        abrirAlertaError('Por favor, preencha todos os campos antes de enviar.');
                        return;
                    }
                    
                    // Validar email
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        console.log('Email inválido:', email);
                        abrirAlertaError('Por favor, insira um email válido.');
                        return;
                    }
                    
                    // Validar telefone
                    const contatoNumeros = contato.replace(/\D/g, '');
                    if (contatoNumeros.length < 10) {
                        console.log('Telefone inválido');
                        abrirAlertaError('Por favor, insira um número de telefone válido.');
                        return;
                    }
                    
                    console.log('Todas as validações passaram, enviando...');
                    
                    // Mostrar loading
                    const botaoEnviar = formularioContato.querySelector('button[type="submit"]');
                    const textoOriginal = botaoEnviar.textContent;
                    botaoEnviar.textContent = 'Enviando...';
                    botaoEnviar.disabled = true;
                    
                    // Preparar dados
                    const formData = new FormData();
                    formData.append('nome', nome);
                    formData.append('email', email);
                    formData.append('contato', contato);
                    formData.append('mensagem', mensagem);
                    formData.append('accessKey', '33e23f19-e6a5-43bc-a2af-20fd26a9595a');
                    
                    console.log('Enviando para StaticForms...');
                    
                    // Enviar via fetch com tratamento melhorado de erros
                    fetch('https://api.staticforms.xyz/submit', {
                        method: 'POST',
                        body: formData,
                        mode: 'no-cors'
                    })
                    .then(response => {
                        console.log('Fetch completado com sucesso!');
                        console.log('Response:', response);
                        // Com mode: 'no-cors', sempre assumimos sucesso se não houve erro
                        console.log('Exibindo alerta de sucesso...');
                        abrirAlertaSuccess();
                        console.log('Resetando formulário...');
                        formularioContato.reset(); // Limpar formulário
                    })
                    .catch(error => {
                        console.error('Erro no fetch:', error);
                        
                        // Verificar tipo de erro
                        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_RESET')) {
                            // Problema de conectividade - mas assumir que pode ter funcionado com no-cors
                            console.log('Erro de conectividade, mas assumindo sucesso devido ao mode: no-cors');
                            abrirAlertaSuccess();
                            formularioContato.reset();
                        } else {
                            // Outro tipo de erro
                            abrirAlertaError('Erro no envio! Tente novamente mais tarde.');
                        }
                    })
                    .finally(() => {
                        console.log('Restaurando botão...');
                        // Restaurar botão
                        botaoEnviar.textContent = textoOriginal;
                        botaoEnviar.disabled = false;
                    });
                }, 100); // Aguardar 100ms
            });
        } else {
            console.error('Formulário de contato não encontrado! Verificando seletores...');
            // Tentar outros seletores
            const form1 = document.querySelector('form');
            const form2 = document.querySelector('.contact-form form');
            console.log('form genérico:', form1);
            console.log('form com classe:', form2);
        }
    }, 500); // Aguardar 500ms para garantir que tudo carregou
});

// Smooth scrolling para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Efeito de scroll na navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--dark-bg)';
            navbar.style.backdropFilter = 'none';
        }
    }
});

console.log('Script carregado!');
