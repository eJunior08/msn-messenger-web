# Messenger

**Um pouco de nostalgia. Muitas conexões.**

Uma releitura responsiva do MSN / Windows Live Messenger, feita com React, TypeScript e Vite. Gradientes azuis, indicadores de presença, mensagens pessoais, sons e o clássico “chamar atenção”, adaptados para uma única janela do navegador.

[Read in English](README.md)

## Executar localmente

Use Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

Abra a URL exibida pelo Vite, normalmente `http://127.0.0.1:5173`. O aplicativo inicia com uma demonstração preenchida. Clique em **Sign out** para ver a tela de entrada. Nenhuma senha é solicitada.

## Funcionalidades

- Conversas em abas, com rascunhos separados.
- Envio com Enter, quebra de linha com Shift+Enter e texto em negrito.
- Emoticons, wink animado e nudge com tremor da conversa.
- Sons sintetizados de mensagem e nudge, com opção de silenciar.
- Anexos locais de até 2 MB, disponíveis para download.
- Busca por nome, email ou mensagem pessoal e seções recolhíveis.
- Adição de contatos locais, favoritos, bloqueio/desbloqueio e remoção.
- Edição de nome, avatar, mensagem pessoal e status de presença.
- Temas azul, verde e rosa.
- Jogo da velha contra o computador local.
- Persistência de mensagens e preferências após recarregar a página.
- Navegação entre contatos e conversa adaptada para celular.

Os diálogos suportam Escape e controle de foco. Os controles têm nomes acessíveis e as animações respeitam a preferência de movimento reduzido.

## Limites da demonstração

Esta versão é uma demonstração local funcional, **não um serviço de mensagens em tempo real**. Os contatos são fictícios. Respostas e indicadores de digitação são simulados. Novos contatos não recebem convites, e a tela de entrada seleciona um perfil local sem autenticação real.

Mensagens, anexos e preferências ficam no localStorage, na chave `messenger-web:v1`. Nada é enviado a um servidor. Os rascunhos duram durante a sessão da página. Se a cota do navegador impedir uma gravação, a interface informa o erro e preserva o último estado salvo. Não há sincronização entre abas ou dispositivos.

A linha de música é conteúdo demonstrativo; não reproduz nem detecta músicas. Chamadas de voz/vídeo, arquivos remotos, contas reais e jogos online ainda não estão implementados. Limpar os dados deste site reinicia a demonstração.

## Arquitetura

```text
src/
  domain/          Modelos, contrato de persistência, validação e regras do jogo
  application/     Casos de uso e persistência serializada
  infrastructure/  Armazenamento local, dados demonstrativos, anexos e áudio
  hooks/           Assinaturas React e respostas simuladas
  components/      Componentes de interface e diálogos
  styles/          Estilos e regras responsivas
  __tests__/       Testes unitários e de componentes com Jest
```

A dependência segue interface → aplicação → domínio. A infraestrutura implementa `MessengerRepository`, injetado em `src/main.tsx`. Domínio e aplicação não importam React, localStorage nem SDK de backend.

As operações do repositório são assíncronas. `StateStore` serializa alterações, usa o estado salvo mais recente e só publica a mudança após a persistência concluir. Uma falha não corrompe o estado nem impede novas tentativas.

Interfaces pequenas, módulos focados e injeção de dependência separam responsabilidades. Todos os arquivos de texto escritos no projeto devem ter **até 150 linhas**. O lockfile gerado é exceção. A regra está em `AGENTS.md` e é verificada no CI.

## Integração futura com backend

Consulte o [guia de integração](docs/backend-integration.md), em inglês. Supabase pode ser um adaptador, mas não é dependência do projeto. Um backend real também exige autenticação, gravações por registro, assinaturas de eventos e resolução de conflitos.

## Testes e build

```sh
npm test
npm run test:coverage
npm run check:lines
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

O Jest verifica mensagens, contatos, recuperação de armazenamento, ordem de gravações assíncronas, falhas de persistência, anexos, jogo e composição de mensagens. O Playwright executa fluxos completos no Chromium desktop e em uma viewport móvel. Essa emulação não equivale a testes no Safari nativo do iOS.

O GitHub Actions executa limite de linhas, cobertura unitária, build e testes e2e. Os limites de cobertura para domínio, aplicação e infraestrutura são 80% de linhas/instruções/funções e 70% de ramificações. `npm run check` agrupa a regra de linhas, testes unitários e build.

Os arquivos de produção ficam em `dist/` e podem ser publicados em uma hospedagem estática. A demonstração não requer variáveis de ambiente. Um override explícito mantém o parser YAML transitivo dos testes em uma versão corrigida.

## Contribuição

Use inglês no código, interface e commits. Siga Conventional Commits, como `feat: add contact groups`. Inclua testes para mudanças de comportamento e mantenha detalhes do backend fora dos componentes.

Projeto independente de nostalgia, sem vínculo com a Microsoft. MSN e Windows Live Messenger pertencem aos respectivos titulares. A interface usa desenhos em CSS e emoji, sem recursos proprietários extraídos nem arquivos de áudio originais.
