import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import { PostStats } from './PostStats'

type GridPostListProps = {
    posts: Models.Document[],
    showUser?: boolean,
    showStats?: boolean
}
export const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
    const { user } = useUserContext()
    return (
        <ul className='grid-container'>
            {posts?.map((post) => (<li className='relative min-w-80 h-80' key={post.$id}>
                <Link to={`/post/${post.$id}`} className='grid-post_link' >
                    <img src={post.imageUrl} alt="post" className='h-full w-full object-cover' />
                </Link>
                <div className='grid-post_user'>
                    {
                        showUser && (<div className='flex items-center justify-center gap-2 flex-1'>
                            <img className='h-8 w-8 rounded-full' src={post.creator.imageUrl} alt="creator" />
                            <p className='line-clamp-1'>{post.creator.name}</p>
                        </div>)
                    }
                    {
                        showStats && (
                            <PostStats post={post} userId={user.id} />
                        )
                    }
                </div>
            </li>))}
        </ul>
    )
}
