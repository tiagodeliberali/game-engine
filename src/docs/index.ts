export class Article {
  id: string;
  title: string;
  content: string;
  snippet?: () => void;
  sections: Article[] = [];

  constructor(
    id: string,
    title: string,
    content: string,
    snippet?: () => void
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.snippet = snippet;
  }

  getHtml() {
    return `<h1>${this.title}</h1>
      
      ${this.content}
      `;
  }

  getIndex() {
    return `<ul>
      ${this.sections.map(
        (x) => `<li><a href='./?game=docs&content=${x.id}'>${x.title}</a></li>`
      )}
      </ul>`;
  }

  getContent(id: string): Article {
    const content = this.search(id);

    return (
      content ||
      new Article(
        "notfound",
        "Content not found",
        `Could not found content for id ${id}.`
      )
    );
  }

  private search(id: string): Article | undefined {
    if (this.id === id) {
      return this;
    }

    if (this.sections.length === 0) {
      return undefined;
    }

    for (let i = 0; i < this.sections.length; i++) {
      const content = this.sections[i].getContent(id);

      if (content) {
        return content;
      }
    }
  }
}

export function getDocs(content: string) {
  const index = new Article(
    "index",
    "Welcome to Game Engine!",
    "This is the most incredible and useful engine, waited by millions of developers around the world!",
    () => {
      // code starts here
    }
  );

  const renderables = new Article(
    "renderables",
    "Renderables",
    "Let's draw our first box!",
    () => {
      // code starts here
    }
  );

  index.sections.push(renderables);

  return { index, content: index.getContent(content) };
}
