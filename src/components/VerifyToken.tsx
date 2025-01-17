import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import axios, { AxiosError } from "axios";
import { IApiResponse } from "@/types/apiResponse";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VerifySchema } from "@/schemas/verifyCodeSchema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

type IToken = {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  username: string;
};
const VerifyToken = ({
  isActive = false,
  setIsActive,
  username = "",
}: IToken) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();

  const handleVerification = async (data: z.infer<typeof VerifySchema>) => {
    setLoading(true);
    try {
      const response = await axios.post<IApiResponse>("/api/verify-code", {
        username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
      router.push("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isActive} onOpenChange={setIsActive}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Enter Verification code
          </DialogTitle>
          <DialogDescription>
            We have sent you six digits verification code on your email. Please
            check and enter the code to proceed further.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVerification)}
            className="flex flex-col justify-center items-center gap-4"
          >
            <FormField
              name="code"
              control={form.control} // to handle state management
              render={({ field }) => (
                <FormItem>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-1/2 m-auto rounded-lg"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyToken;
