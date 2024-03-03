import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
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
import { signUpValidation } from "@/lib/validations"
import { Loader } from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queryAndMutation"
import { useUserContext } from "@/context/AuthContext"


export const SignupForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount()
    const { mutateAsync: signInAccount, isPending: isSigning } = useSignInAccount()


    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",

        },
    })
    const onSubmit = async (values: z.infer<typeof signUpValidation>) => {

        const newUser = await createUserAccount(values)
        if (!newUser) {
            return toast({
                title: "Uh oh Somethings wrong",
                description: "Could not create a new account",
                variant: "destructive"
            })
        }

        const session = await signInAccount({
            email: values.email,
            password: values.password
        })
        if (!session) {
            return toast({
                title: "Sign in failed ,please try again"
            })
        }
        const isLoggedIn = await checkAuthUser()
        if (isLoggedIn) {
            form.reset()
            navigate('/')
        }
        else {
            return toast({
                title: 'sign up falied, please try again',
                variant: "destructive"
            })
        }




    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col ">
                <img src="assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
                    Create a new account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To use Enstaa, Please enter your details
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col mt-4 gap-2 w-full">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit"
                        className="shad-button_primary">{
                            isCreatingUser ? (
                                <div className="flex-center gap-2">
                                    <Loader /> loading...
                                </div>
                            ) : "Submit"
                        }</Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link
                            to="/signin"
                            className="text-primary-500 text-small-semibold ml-1">
                            Log in
                        </Link>
                    </p>
                </form>
            </div >
        </Form>
    )
}
