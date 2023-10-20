import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";

const MetricComponent = () => {
  return (
    <Box component="span" sx={{ p: 2, width: 1 / 4, textAlign: "left" }}>
      <Card
        flex={1}
        variant="outlined"
        sx={{ p: 2, marginLeft: 0, textAlign: "left" }}
      >
        <Typography variant={"body2"} marginBottom={"0.5rem"} fontWeight="bold">
          Questions done by difficulty
        </Typography>
        <Box display={"flex"} flex={1} justifyContent={"flex-start"}>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "Easy" },
                  { id: 1, value: 15, label: "Medium" },
                  { id: 2, value: 20, label: "Hard", color: "#FF0000" },
                ],
                innerRadius: 55,
              },
            ]}
            width={300}
            height={140}
          >
            <PieCenterLabel>Attempts</PieCenterLabel>
          </PieChart>
        </Box>
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
