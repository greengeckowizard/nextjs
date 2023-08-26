import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { sdk } from "../../../../lib/apiClient";
import { mutate } from "swr";
import useSWR from "swr";
import { Typography, Box, IconButton } from "@mui/material";
import { AddCircleOutline, InsertLink, LowPriority } from "@mui/icons-material";
import ChainStep from "./partial/ChainStep";
export default function ChainSteps() {
  const router = useRouter();
  const steps = useSWR(
    "chain/" + router.query.chain,
    async () =>
      (await sdk.getChain(router.query.chain)).chain[router.query.chain]
  );
  console.log(steps.data);
  const handleAdd = async () => {
    // TODO: See Chain Management page in Streamlit app.  This needs modified, missing some fields..
    //  If prompt type is prompt, we need to show prompt category and prompt name drop downs.
    //  prompt_name and prompt_category are what is expected for promptArgs in addStep if prompt type is prompt.
    //  command_name and command_args are what is expected for promptArgs in addStep if prompt type is command.
    //  chain and input are what is expected for promptArgs in addStep if prompt type is chain at minimum, but we will also want to show the chain args.
    //  See Chain Management page in Streamlit app to see the available overrides/options for each prompt type.
    await sdk.addStep(
      router.query.chain,
      steps.data.length + 1,
      agentName,
      promptType,
      promptArgs
    );
    mutate("chain/" + router.query.chain);
  };
  return (
    <>
      {steps?.data?.map((step, index) => {
        return (
          <>
            <ChainStep
              key={index}
              {...step}
              last_step={steps.data.length === index + 1}
              updateCallback={() => {
                return null;
              }}
            />
            {index === steps.data.length - 1 ? null : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                {step.run_next_concurrent ? (
                  <>
                    <IconButton>
                      <InsertLink sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bolder", mx: "1rem" }}
                    >
                      Runs Concurrently With
                    </Typography>
                  </>
                ) : (
                  <>
                    <IconButton>
                      <LowPriority sx={{ fontSize: "2rem" }} />
                    </IconButton>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bolder", mx: "1rem" }}
                    >
                      Runs Sequentially Before
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </>
        );
      })}
      <Box
        sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}
      >
        <IconButton onClick={handleAdd}>
          <AddCircleOutline sx={{ fontSize: "2rem" }} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: "bolder", mx: "1rem" }}>
          Add Step
        </Typography>
      </Box>
    </>
  );
}
