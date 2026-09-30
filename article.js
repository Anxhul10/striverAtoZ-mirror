const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadArticle() {
    const content = document.getElementById("article-content");

    if (!id) {
        content.textContent = "No article specified.";
        return;
    }

    try {
        const response = await fetch(`articles/${id}.md`);

        if (!response.ok) {
            content.textContent = "Article not found.";
            return;
        }

        const markdown = await response.text();
        content.innerHTML = marked.parse(markdown);
    } catch (error) {
        content.textContent = "Could not load the article.";
        console.error(error);
    }
}

loadArticle();