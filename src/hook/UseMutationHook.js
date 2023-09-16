import { useMutation } from "@tanstack/react-query";

export const UserMutationHook = (fnCallback) => {
  //gọi API
  const mutation = useMutation({
    mutationFn: fnCallback,
  });
  return mutation;
};
