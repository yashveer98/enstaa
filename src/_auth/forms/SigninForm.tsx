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
import { signInValidation } from "@/lib/validations"
import { Loader } from "@/components/shared/Loader"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queryAndMutation"
import { useUserContext } from "@/context/AuthContext"


export const SigninForm = () => {
    const { toast } = useToast()
    const navigate = useNavigate()
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext()


    const { mutateAsync: signInAccount, isPending } = useSignInAccount()


    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {

            email: "",
            password: "",

        },
    })
    const onSubmit = async (values: z.infer<typeof signInValidation>) => {


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
                    Login to you're account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    Welcome back, Please enter your details
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col mt-4 gap-2 w-full">
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
                        disabled={
                            isPending || isUserLoading
                        }
                        className="shad-button_primary">{
                            isUserLoading || isPending ? (
                                <div className="flex-center gap-2">
                                    <Loader /> loading...
                                </div>
                            ) : "Submit"
                        }
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Don't have an account?
                        <Link
                            to="/signup"
                            className="text-primary-500 text-small-semibold ml-1">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div >
        </Form>
    )
}
