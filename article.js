const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadArticle() {
    const container = document.getElementById("article-content");

    container.replaceChildren();
    if (!id) {
        container.textContent = "No article specified.";
        return;
    }

    try {
        const response = await fetch(`articles/${id}.md`);

        if (!response.ok) {
            container.textContent = "Article not found.";
            return;
        }

        const markdown = await response.text();
        const parsed = new DOMParser().parseFromString(
            marked.parse(markdown),
            "text/html"
        );

        const elements = [...parsed.body.children];

        let currentSection = null;
        let currentContent = null;

        for (const element of elements) {
            if (element.tagName === "H1") {
                const title = document.createElement("h1");
                title.className = "article-title";
                title.textContent = element.textContent;
                container.append(title);
                continue;
            }

            if (element.tagName === "H2") {
                const section = document.createElement("details");
                section.className = "article-section";

                const summary = document.createElement("summary");
                summary.textContent = element.textContent;

                const content = document.createElement("div");
                content.className = "section-content";

                section.append(summary, content);
                container.append(section);

                currentSection = section;
                currentContent = content;
                continue;
            }

            if (element.tagName === "H3" && currentSection) {
                const nested = document.createElement("details");
                nested.className = "nested-section";

                const summary = document.createElement("summary");
                summary.textContent = element.textContent;

                const content = document.createElement("div");
                content.className = "nested-content";

                nested.append(summary, content);
                currentContent.append(nested);

                currentContent = content;
                continue;
            }

            if (currentContent) {
                currentContent.append(element);
            } else {
                container.append(element);
            }
        }
    } catch (error) {
        console.error(error);
        container.textContent = "Could not load the article.";
    }
}

loadArticle();