# CuidaSaúde — Aplicativo de Cuidados com a Saúde

## Integrantes do Grupo

- Lucas Garcia — RM554070
- Enzo Barbeli — RM554272
- Enzzo Monteiro Barros Silva — RM552616
- Pedro Chaves — RM553988
- Felipe Santos — RM554249
- Iago Diniz — RM553776

---

## Sobre o Projeto

**CuidaSaúde** é um aplicativo mobile desenvolvido em **React Native + TypeScript** com Expo, que oferece uma interface humanizada para pacientes acompanharem suas rotinas de cuidados com a saúde. O app permite gerenciar tarefas diárias, registrar progresso, controlar preferências de privacidade e persistir dados localmente.

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.25 | Plataforma e build |
| TypeScript | ^5.3.3 | Tipagem estática com strict mode |
| React Navigation | ^7.x | Navegação entre telas |
| AsyncStorage | 2.1.2 | Persistência local de dados |
| @react-native-picker/picker | 2.11.1 | Seletor de opções |

---

## Estrutura do Projeto

```
CuidaSaude/
├── App.tsx                          # Raiz — envolve com AuthProvider
├── tsconfig.json                    # TypeScript strict mode
├── package.json
└── src/
    ├── types/
    │   └── index.ts                 # Interfaces, Enums e tipos de navegação
    ├── context/
    │   └── AuthContext.tsx          # Contexto global de autenticação
    ├── services/
    │   ├── storage.ts               # Funções AsyncStorage (sessão, prefs, tarefas, histórico)
    │   └── data.ts                  # Dados padrão (tarefas e histórico)
    ├── components/
    │   ├── LoadingOverlay.tsx        # Modal de carregamento reutilizável
    │   └── TaskCard.tsx             # Card de tarefa reutilizável
    ├── screens/
    │   ├── LoginScreen.tsx          # Login com validação e loading state
    │   ├── DashboardScreen.tsx      # FlatList de tarefas + progresso
    │   ├── CheckInScreen.tsx        # Check-in com status, feedback e humor
    │   ├── HistoryScreen.tsx        # FlatList do histórico + estatísticas
    │   └── ProfileScreen.tsx        # Preferências persistidas + logout
    └── navigation/
        ├── RootNavigator.tsx        # Stack Navigator tipado
        └── MainNavigator.tsx        # Bottom Tab Navigator tipado
```

---

## Funcionalidades

### Tela de Login
- Validação de email e senha com mensagens de erro em tempo real
- Estado de **loading** com ActivityIndicator durante autenticação
- Sessão persistida com **AsyncStorage** — reabre logado
- Credenciais de teste visíveis na tela

### Dashboard (Rotina Diária)
- **FlatList** tipada com as tarefas do dia
- Barra de progresso calculada dinamicamente
- Tarefas persistidas e recarregadas ao voltar do Check-in
- `useEffect` para persistência e `useFocusEffect` para recarregamento

### Check-in de Tarefas
- Seleção de status: Feito / Não Feito (enum `TaskStatus`)
- Feedback textual com validação
- Seletor de humor com enum `MoodValue`
- Salva resultado direto no **AsyncStorage**

### Histórico
- **FlatList** do histórico de dias
- Estatísticas de taxa de conclusão, tarefas completas e dias ativos
- Filtro por período (enum `HistoryPeriod`)
- Carregado do **AsyncStorage** com fallback para dados padrão

### Perfil e Privacidade
- Preferências carregadas e salvas no **AsyncStorage**
- Switches tipados com `UserPreferences`
- Logout via `AuthContext` que limpa a sessão persistida

---

## TypeScript — Destaques

- `tsconfig.json` com `strict: true`, `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`
- Enums: `TaskStatus`, `MoodValue`, `HistoryPeriod`
- Interfaces: `Task`, `HistoryEntry`, `UserProfile`, `UserPreferences`, `AuthSession`
- Tipos de navegação: `RootStackParamList`, `MainTabParamList`
- Props tipadas em todos os componentes e telas
- `useState<T>` e `useEffect` tipados explicitamente
- Zero uso de `any`

---

## Persistência Local (AsyncStorage)

| Dado | Chave | Quando salva |
|---|---|---|
| Sessão do usuário | `@cuida_session` | Login / Logout |
| Preferências | `@cuida_preferences` | Salvar no Perfil |
| Tarefas do dia | `@cuida_tasks` | Após Check-in |
| Histórico | `@cuida_history` | Carga inicial |

Os dados sobrevivem ao fechamento do app. A sessão é restaurada automaticamente no boot.

---

## Credenciais de Teste

```
Email: paciente@cuida.com
Senha: 123456
```

---

## Instalação e Execução

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go no smartphone **ou** emulador Android/iOS

### Passos

```bash

# 1. Instale as dependências
npm install

# 2. Inicie o projeto
npm start

# 3. Execute
# Android: pressione 'a' no terminal
# iOS:     pressione 'i' no terminal (apenas macOS)
# Expo Go: escaneie o QR Code com o app Expo Go
```

### Verificar TypeScript

```bash
npm run type-check
```


**Desenvolvido com 💙 pela equipe CuidaSaúde**
