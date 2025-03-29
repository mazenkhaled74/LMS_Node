class Media{
    #id;
    #url;
    #type;

    constructor({id = null, url, type}){
        this.#id = id;
        this.#url = url;
        this.#type = type;
    }

    getId(){
        return this.#id;
    }

    getUrl(){
        return this.#url;
    }

    getType(){
        return this.#type;
    }

    setUrl(url){
        this.#url = url;
    }

    setType(type){
        this.#type = type;
    }

    toJSON(){
        return {
            id: this.#id,
            url: this.#url,
            type: this.#type
        };
    }
}

export default Media;