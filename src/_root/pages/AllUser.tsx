
import { Loader } from '@/components/shared/Loader'
import UserCard from '@/components/shared/UserCard'
import { useGetUsers } from '@/lib/react-query/queryAndMutation'
import { Models } from 'appwrite'


export const AllUser = () => {
    const { data: creators, hasNextPage, fetchNextPage, isPending } = useGetUsers()
    console.log(creators)

    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                {isPending && !creators ? (
                    <Loader />
                ) : (
                    <ul className="user-grid">
                        {creators?.pages.map((page) => {
                            return page?.documents.map((creator: Models.Document) => (
                                <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                                    <UserCard user={creator} />
                                </li>
                            ))
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}
