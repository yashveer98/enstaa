import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queryAndMutation'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import { Loader } from './Loader'

type PostStatsProps = {
    post?: Models.Document,
    userId: string
}
export const PostStats = ({ post, userId }: PostStatsProps) => {
    const { data: currentUser } = useGetCurrentUser()
    const likeList = post?.likes.map((user: Models.Document) => user.$id)
    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id)

    useEffect(() => { setisSaved(!!savedPostRecord) }, [currentUser])
    const [likes, setLikes] = useState(likeList)
    const [isSaved, setisSaved] = useState(false)

    const { mutate: savePost, isPending: isSavingPost } = useSavePost()
    const { mutate: likePost } = useLikePost()
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost()


    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()
        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId)
        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        }
        else {
            newLikes.push(userId)
        }
        setLikes(newLikes)
        likePost({ postId: post?.$id || '', likesArray: newLikes })

    }
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (savedPostRecord) {
            setisSaved(false)
            deleteSavedPost(savedPostRecord.$id)
        }
        else {
            setisSaved(true)
            savePost({ postId: post?.$id || '', userId })
        }
    }
    return (
        <div className='flex justify-between items-center z-20'>
            <div className='flex gap-2 mr-5'>
                <img src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"} alt="like"
                    height={20}
                    width={20}
                    onClick={handleLikePost}
                    className='cursor-pointer' />
                <p>{likes.length}</p>
            </div>
            <div className='flex gap-2'>
                {isSavingPost || isDeletingSaved ? <Loader /> : <img src={isSaved ? "/assets/icons/saved.svg" : '/assets/icons/save.svg'} alt="save"
                    height={20}
                    width={20}
                    onClick={handleSavePost}
                    className='cursor-pointer' />}
            </div>
        </div>
    )
}
