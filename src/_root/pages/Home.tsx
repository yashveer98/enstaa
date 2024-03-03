import { Loader } from "@/components/shared/Loader"
import { PostCard } from "@/components/shared/PostCard"
import { useGetRecentPost } from "@/lib/react-query/queryAndMutation"
import { Models } from "appwrite"

export const Home = () => {
    const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = useGetRecentPost()

    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
                    {isPostLoading && !posts ? (<Loader />) : (

                        < ul className="flex flex-col flex-1 w-full gap-9">
                            {
                                posts?.documents.map((post: Models.Document) => (<PostCard post={post} key={post.caption} />))
                            }
                        </ul>
                    )}
                </div>
            </div>
        </div >
    )
}
