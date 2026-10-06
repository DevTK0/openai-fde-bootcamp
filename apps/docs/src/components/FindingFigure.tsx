import type { ComponentProps } from "react";
import { Plot } from "@workspace/ui/components/report-chart";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

type Props = ComponentProps<typeof Plot> & { source: string };

export function FindingFigure({ source, ...chart }: Props) {
  return (
    <figure className="article-figure not-content my-8 min-w-0 space-y-4">
      <Plot {...chart} />
      <Table>
        <TableCaption>
          {chart.title}. Values rounded to two decimal places.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Category</TableHead>
            {chart.series.map((series) => (
              <TableHead scope="col" key={series.key}>
                {series.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {chart.rows.map((row, index) => (
            <TableRow key={index}>
              <TableHead scope="row">{row.name}</TableHead>
              {chart.series.map((series) => {
                const value = row[series.key];
                return (
                  <TableCell key={series.key}>
                    {typeof value === "number"
                      ? value.toLocaleString("en-SG", {
                          maximumFractionDigits: 2,
                        })
                      : value}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <figcaption className="text-sm text-muted-foreground">
        {source}
      </figcaption>
    </figure>
  );
}
