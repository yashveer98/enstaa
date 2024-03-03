import { useGetUserById, useUpdateUser } from "@/lib/react-query/queryAndMutation"
import { useNavigate, useParams } from "react-router-dom"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { editProfileValidation } from "@/lib/validations"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { FileUploader } from "@/components/shared/FileUploader"
import { useUserContext } from "@/context/AuthContext"
import { Loader } from "@/components/shared/Loader"
import ProfileUploader from "@/components/shared/ProfileUploader"

export const UpdateProfile = () => {
    const { id } = useParams()
    const { setUser } = useUserContext()
    const { data: user, isFetching } = useGetUserById(id || '')
    const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUser()
    const navigate = useNavigate()
    const form = useForm<z.infer<typeof editProfileValidation>>({
        resolver: zodResolver(editProfileValidation),
        defaultValues: {
            name: user ? user.name : '',
            bio: user ? user.bio : '',
            file: []

        },
    })
    const onSubmit = async (values: z.infer<typeof editProfileValidation>) => {

        try {
            const updatedUser = await updateUser({ ...values, userId: user.$id, imageId: user?.imageId, imageUrl: user?.imageUrl })
            if (!updatedUser) {
                toast({ title: 'please try again' })
            }
            return navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex flex-1">
            <div className="common-container">
                <div className="flex-start gap-3 justify-start w-full max-w-5xl">
                    <img
                        src="/assets/icons/edit.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
                        <FormField
                            control={form.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem className="flex">
                                    <FormControl>
                                        <ProfileUploader
                                            fieldChange={field.onChange}
                                            mediaUrl={user?.imageUrl}
                                        />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="shad-input" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="shad-form_label">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="shad-textarea custom-scrollbar"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="shad-form_message" />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-4 items-center justify-end">
                            <Button
                                type="button"
                                className="shad-button_dark_4"
                                onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="shad-button_primary whitespace-nowrap"
                                disabled={isLoadingUpdate}>
                                {isLoadingUpdate && <Loader />}
                                Update Profile
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
