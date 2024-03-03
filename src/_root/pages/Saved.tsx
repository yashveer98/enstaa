import { GridPostList } from "@/components/shared/GridPostList"
import { Loader } from "@/components/shared/Loader"
import { useUserContext } from "@/context/AuthContext"
import { useGetSavedById } from "@/lib/react-query/queryAndMutation"
import { Models } from "appwrite"


export const Saved = () => {
    const { user } = useUserContext()
    const { data: saves, isFetching } = useGetSavedById(user.id)
    const savedPost = saves?.documents.map((save: Models.Document) => ({ ...save.post }))
    const haveSavedPost = savedPost?.length !== 0
    console.log(saves)
    console.log(savedPost)


    return (
        <div className='explore-container'>
            <div className='explore-inner_container'>
                <h2 className='h3-bold md:h2-bold w-full'>Saved Posts</h2>
            </div>
            <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
                {isFetching ? (
                    <Loader />
                ) : (
                    !haveSavedPost ? (<p className="text-light-4">No available posts</p>) : (<GridPostList posts={savedPost} showStats={false} />)
                )}


            </div>
        </div>
    )
}
