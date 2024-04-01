//import {test} from "node:test";
//import assert from "node:assert"

const dummy = (blogs) => {
    return blogs.length === 0
        ? 1
        : 1
}

const totalLikes = (blogs) => {
    let summa = 0;
    for (let i = 0; i < blogs.length; i++) {
        summa += blogs[i].likes;
    }
    return summa;
}

const favorite = (blogs) => {
    let maxBlog = blogs[0];
    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > maxBlog.likes) {
            maxBlog = blogs[i]
        }
    }
    return maxBlog
}

const mostBlogs = (blogs) => {
    let amounts = [];

    for (let i = 0; i < blogs.length; i++) {
        let found = false;
        for (let j = 0; j < amounts.length; j++) {
            if (amounts[j].author === blogs[i].author) {
                amounts[j].posts++;
                found = true;
                break;
            }
        }
        if (!found) {
            amounts.push({author: blogs[i].author, posts: 1});
        }
    }

    let mostPosts = amounts[0];

    for (let i = 0; i < amounts.length; i++) {
        if (amounts[i].posts > mostPosts.posts) {
            mostPosts = amounts[i]
        }
    }

    return mostPosts;
}

const mostLikes = (blogs) => {
    let amounts = [];

    for (let i = 0; i < blogs.length; i++) {
        let found = false;
        for (let j = 0; j < amounts.length; j++) {
            if (amounts[j].author === blogs[i].author) {
                amounts[j].likes += blogs[i].likes;
                found = true;
                break;
            }
        }
        if (!found) {
            amounts.push({author: blogs[i].author, likes: blogs[i].likes});
        }
    }

    let most = amounts[0];

    for (let i = 0; i < amounts.length; i++) {
        if (amounts[i].likes > most.likes) {
            most = amounts[i]
        }
    }

    return most;
}

export {dummy, totalLikes, favorite, mostBlogs, mostLikes}


