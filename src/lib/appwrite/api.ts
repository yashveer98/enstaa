import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";
import { error } from "console";


export const createUserAccount = async (user: INewUser) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        if (!newAccount) throw Error
        const imageUrl = avatars.getInitials(user.name)
        const newUser = await saveUserToDb({
            accountId: newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            imageUrl: imageUrl,
            username: user.username
        })
        if (!newUser) throw Error
        return newUser
    }
    catch (error) {
        console.log(error)
        return error
    }

}
export const saveUserToDb = async (user: {
    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username: string
}) => {
    try {

        const newUser = await databases.createDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user)
        return newUser
    }
    catch (error) {
        console.log(error)
        return error
    }
}
export const signInAccount = async (user: { email: string, password: string }) => {
    try {

        const session = await account.createEmailSession(user.email, user.password)
        return session
    }
    catch (error) {
        console.log(error)
    }

}
export const getCurrentUser = async () => {
    try {

        const currentAccount = await account.get()
        if (!currentAccount) throw Error
        const currentUser = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)])

        if (!currentUser) throw Error
        return currentUser.documents[0]
    }
    catch (error) {
        console.log(error)

    }
}
export const signOutAccount = async () => {
    try {

        const session = await account.deleteSession('current')
        return session
    } catch (error) {
        console.log(error)
    }
}
export const createPost = async (post: INewPost) => {
    try {
        const uploadedFile = await uploadFile(post.file[0])
        if (!uploadedFile) throw Error
        const fileUrl = await getFilePreview(uploadedFile.$id)
        if (!fileUrl) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
        const tags = post.tags?.replace(/ /g, "").split(',')
        const newPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, ID.unique(), {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags
        })
        if (!newPost) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
        return newPost
    }
    catch (error) {
        console.log(error)
    }

}
export const uploadFile = async (file: File) => {
    try {
        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file)
        if (!uploadedFile) throw Error
        return uploadedFile

    } catch (error) {
        console.log(error)
    }
}
export const getFilePreview = async (fileId: string) => {
    try {

        const fileUrl = await storage.getFilePreview(appwriteConfig.storageId, fileId, 2000, 2000, 'top', 100)
        return fileUrl
    }
    catch (error) {
        console.log(error)
    }
}
export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return { status: 'ok' }
    }
    catch (error) { console.log(error) }
}
export const getRecentPost = async () => {
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(20)])

        if (!posts) throw Error
        return posts
    }
    catch (error) {
        console.log(error)
    }
}
export const likePost = async (postId: string, likesArray: string[]) => {

    try {
        const updatedPost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId, {
            likes: likesArray
        })
        if (!updatedPost) throw Error
        return updatedPost
    }
    catch (error) {
        console.log(error)
    }
}
export const savePost = async (postId: string, userId: string) => {

    try {
        const updatedPost = await databases.createDocument(appwriteConfig.databaseId, appwriteConfig.savesCollectionId, ID.unique(), {
            user: userId,
            post: postId
        })
        if (!updatedPost) throw Error
        return updatedPost
    }
    catch (error) {
        console.log(error)
    }
}
export const deleteSavedPost = async (savedRecordId: string) => {

    try {
        const statusCode = await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.savesCollectionId, savedRecordId)
        if (!statusCode) throw Error
        return { status: 'ok' }
    }
    catch (error) {
        console.log(error)
    }
}
export const getPostById = async (postId: string) => {
    try {
        const post = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId)
        if (!post) throw Error
        return post
    } catch (error) {
        console.log(error)
    }
}
export const updatePost = async (post: IUpdatePost) => {
    const hasUpdatePost = post.file.length > 0
    let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId
    }
    try {
        if (hasUpdatePost) {
            const uploadedFile = await uploadFile(post.file[0])
            if (!uploadedFile) throw Error
            const fileUrl = await getFilePreview(uploadedFile.$id)
            if (!fileUrl) {
                deleteFile(uploadedFile.$id)
                throw Error
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }

        }
        const tags = post.tags?.replace(/ /g, "").split(',')
        const updatedPost = await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, post.postId, {
            caption: post.caption,
            imageUrl: image.imageUrl,
            imageId: image.imageId,
            location: post.location,
            tags: tags
        })
        if (!updatedPost) {
            deleteFile(post.imageId)
            throw Error
        }
        return updatedPost
    }
    catch (error) {
        console.log(error)
    }

}
export const deletePost = async (postId: string, imageId: string) => {
    if (!postId || !imageId) throw Error
    try {
        await databases.deleteDocument(appwriteConfig.databaseId, appwriteConfig.postCollectionId, postId)
        return { status: 'ok' }
    }
    catch (error) {
        console.log(error)
    }
}
export const getInfinitePosts = async ({ pageParam }: { pageParam: number }) => {

    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const post = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, queries)
        if (!post) throw Error

        return post
    }
    catch (error) {
        console.log(error)
    }
}
export const searchPosts = async (searchTerm: string) => {


    try {
        const post = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.postCollectionId, [Query.search('caption', searchTerm)])
        if (!post) throw Error

        return post
    }
    catch (error) {
        console.log(error)
    }
}
export const getAllUsers = async ({ pageParam }: { pageParam: number }) => {
    const queries = [Query.limit(20)]
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {

        const allUser = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries)

        if (!allUser) throw Error
        return allUser
    }
    catch (error) {
        console.log(error)

    }
}
export const getSavedPost = async (userId: string) => {
    try {
        const savedPost = await databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.savesCollectionId, [Query.equal('user', userId)])

        if (!savedPost) throw Error

        return savedPost
    }
    catch (error) {
        console.log(error)
    }
}
export const getUserById = async (userId: string) => {
    try {
        const user = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId)
        if (!user) throw Error
        return user
    }
    catch (error) {
        console.log(error)
    }
}
export const updateUser = async (user: IUpdateUser) => {
    const hasFileToUpdate = user.file.length > 0
    let image = {
        imageId: user.imageId,
        imageUrl: user.imageUrl
    }
    try {
        if (hasFileToUpdate) {
            const uploadedFile = await uploadFile(user.file[0])
            if (!uploadedFile) throw Error
            const fileUrl = await getFilePreview(uploadedFile.$id)
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id)
                throw Error
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id, }
        }
        const updatedUser = await databases.updateDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageId: image.imageId,
                imageUrl: image.imageUrl,
            })
        if (!updatedUser) {
            if (hasFileToUpdate) {
                await deleteFile(image.imageId)
            }
            throw Error
        }
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId)
        }
        return updatedUser

    }
    catch (error) {
        console.log()
    }
}