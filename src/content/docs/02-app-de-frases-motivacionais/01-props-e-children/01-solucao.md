---
title: Solução 01
---

## Transformando o componente `QuoteCard` em um componente TS

O primeiro passo é transformar o componente em um componente _typescript_. Como nosso projeto inteiro já está configurado como um projeto _typescript_, precisamos apenas mudar a extensão do arquivo para `.tsx`.

### Tipando a prop recebida

Assim que a extensão é alterada um erro já aparece na tela (se você não enxergou, só rodar `npx tsc` para rodar o _type-checking_ do _typescript_):

```bash title="Erro typescript"
Binding element 'quote' implicitly has an 'any' type.ts(7031)
```

Esse erro ocorre porque o _typescript_ não gosta de any implícito - se você não disser qual é o tipo dessa prop, ele irá inferir um `any`. E _sempre_ devemos tentar evitar `any`s em nosso já que eles não trazem informações e deixam nossa base de código mais frágil.

Aqui temos já uma decisão a fazer: como tipar essa prop?

### Tipando _inline_

A solução mais rápida e direta é tiparmos as props diretamente no parâmetro da função do componente. Podemos dar um `console.log` e ver que um `quote` é feito de `author`, `id` e `quote`.

#### Tipando na origem

O certo mesmo é "escavarmos" até a origem desses dados e tentar tipar-los lá. Se formos ver, o componente `App` chama a função `fetchQuote`.

Vamos abrir o arquivo `src/lib/services.ts` e tipar o objeto `quote` diretamente na função `fetchQuote()`:

```typescript {4,5}
export async function fetchQuote() {
  // fetch json data from file
  const res = await fetch('../../data/quotes.json');
  const quotes: { author: string; id: number; quote: string }[] =
    await res.json();
  // pick a random quote
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return quote;
}
```

#### Tipando a Prop

Pronto, agora que o `quote` já está devidamente tipado (coloque o mouse em cima da variável `quote` dentro do componente `App.js` para verificar), vamos tipar _inline_ no componente `QuoteCard.tsx`.

```typescript {1-5}
export default function QuoteCard({
  quote,
}: {
  quote: { quote: string; author: string };
}) {
  return (
    <article className="max-w-4xl p-10 mx-auto mt-12 bg-white border-2 border-gray-200 shadow-2xl rounded-2xl bg-opacity-10">
      <p className="font-serif text-3xl italic leading-normal text-gray-700 font-extralight">
        {quote.quote}
      </p>
      <p className="mt-10 text-2xl text-black">-- {quote.author}</p>
    </article>
  );
}
```

Para entender o código acima, pense que estamos tipando o parâmetro `props` da função `QuoteCard`. Sabemos que o parâmetro props é um objeto que quase sempre é desestruturado. Então o tipo que vamos utilizar é:

1. Um objeto (referindo-se a `props`)
2. Esse objeto possui a chave quote (referindo-se à prop `quote`)
3. Quote é um outro objeto com as chaves `author`, `quote`, e `id`.

Em alguns casos tipar _inline_ é a opção mais rápida e prática. Mas pode tornar nossos componentes difíceis de serem lidos. Por isso vamos optar por tipar de outra forma.

#### Extraindo o tipo `Quote` para um arquivo à parte

Antes de vermos outras duas formas de tiparmos props, já que estamos usando o tipo `Quote` em dois lugares diferentes, vamos extraí-lo para um arquivo à parte e adicionar o código:

Vamos criar o arquivo `src/lib/types.ts`

```typescript title="src/lib/types.ts"
export type Quote = {
  id: string;
  author: string;
  quote: string;
};
```

Agora vamos importá-lo tanto no arquivo `src/lib/services.ts` como no componente `App.tsx`.

### Tipando com `interface`

Tipamos de forma _inline_ as props, mas poderíamos fazer isso com interface:

```jsx ins={3-5,7}
import { Quote } from '../lib/types';

interface QuoteCardProps {
  quote: Quote;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <article className="max-w-4xl p-10 mx-auto mt-12 bg-white border-2 border-gray-200 shadow-2xl rounded-2xl bg-opacity-10">
      <p className="font-serif text-3xl italic leading-normal text-gray-700 font-extralight">
        {quote.quote}
      </p>
      <p className="mt-10 text-2xl text-black">-- {quote.author}</p>
    </article>
  );
}
```

### Tipando com `type`

Da mesma forma, poderíamos fazer com um _type alias_

```jsx ins={7-9}
import { Quote } from '../lib/types';

// interface QuoteCardProps {
//   quote: Quote;
// }

type QuoteCardProps = {
  quote: Quote,
};

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <article className="max-w-4xl p-10 mx-auto mt-12 bg-white border-2 border-gray-200 shadow-2xl rounded-2xl bg-opacity-10">
      <p className="font-serif text-3xl italic leading-normal text-gray-700 font-extralight">
        {quote.quote}
      </p>
      <p className="mt-10 text-2xl text-black">-- {quote.author}</p>
    </article>
  );
}
```

### Type Alias ou Interface?

Essa provavelmente é a pergunta mais formulada no universo Typescript e a resposta é: qualquer um! Existem algumas pequenas diferenças (que provavelmente não definirão a escolha) entre as duas formas, mas basicamente é uma questão de escolha.

Eu particularmente uso _type alias_ pela versatilidade em criar tipos que vão além de objetos. Mas é uma preferência pessoal.

## Transformando o componente App em componente TS

Vamos para a segunda parte da questão, que é transformarmos o `App.jsx` em `App.tsx`.

O primeiro erro que aparece é:

```bash
Argument of type 'Quote' is not assignable to parameter of type 'SetStateAction<undefined>'.
```

Isso ocorre porque o `useState` não sabe exatamente qual é o formato do estado `quote`, já que ele é inicializado com `undefined`.

Vamos ver mais para frente como fazer isso, mas por enquanto vamos inicializar um objeto com as propriedades vazias no useState

```jsx
  // (...)
function App() {
  const [quote, setQuote] = useState({quote: '', author: '', id: ''});
  // (...)
```

Um outro erro ainda vai persistir que é o de resolver as importações. Para isso precisamos

- Arrumar as importações no `main.jsx`
- Transformar o `main.jsx` em `main.tsx`
- Ajustar importações no `index.html`
- Adicionar um _"non null assertion"_ no `main.tsx`
