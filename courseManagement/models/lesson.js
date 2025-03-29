class Lesson{
    #id;
    #title;
    #description;
    #content;

    constructor({id = null, title, description, content}){
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#content = Array.isArray(content) ? content : [];
    }

    getId(){
        return this.#id;
    }

    getTitle(){
        return this.#title;
    }

    getDescription(){
        return this.#description;
    }

    getContent(){
        return this.#content;
    }

    setTitle(title){
        this.#title = title;
    }

    setDescription(description){
        this.#description = description;
    }

    setContent(content){
        this.#content = content;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            content: this.#content.map(media => media.toJSON()),
        };
    }
}

export default Lesson;