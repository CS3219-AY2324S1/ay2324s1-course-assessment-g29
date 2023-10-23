import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";

const MetricComponent = ({ easyCount, normalCount, hardCount }) => {
  const totalQuestions = easyCount + normalCount + hardCount;
  const hasQuestionDone = totalQuestions > 0;

  return (
    <Box
      component="span"
      sx={{ p: 2, width: "50%", textAlign: "left" }}
      flex={1}
    >
      <Card
        flex={1}
        variant="outlined"
        sx={{ p: 2, marginLeft: 0, textAlign: "left" }}
      >
        <Typography variant={"body2"} marginBottom={"0.5rem"} fontWeight="bold">
          Questions done by difficulty
        </Typography>
        {hasQuestionDone ? (
        <Box display={"flex"} flex={1} justifyContent={"flex-start"}>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: easyCount, label: "Easy" },
                  { id: 1, value: normalCount, label: "Medium" },
                  { id: 2, value: hardCount, label: "Hard", color: "#FF0000" },
                ],
                innerRadius: 55,
              },
            ]}
            width={300}
            height={140}
          >
            <PieCenterLabel>{`Total: ${totalQuestions}`}</PieCenterLabel>
          </PieChart>
        </Box>) : ( <Typography variant={"body2"} marginBottom={"0.5rem"} fontWeight="bold">No question done yet, get started today! </Typography>)}
      </Card>
    </Box>
  );
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 14,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default MetricComponent;
