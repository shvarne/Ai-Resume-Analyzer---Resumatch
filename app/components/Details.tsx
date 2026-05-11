import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
                score > 69
                    ? "bg-badge-green"
                    : score > 39
                        ? "bg-badge-yellow"
                        : "bg-badge-red"
            )}
        >
            <img
                src={
                    score > 69
                        ? "/icons/check.svg"
                        : "/icons/warning.svg"
                }
                alt="score"
                className="size-4"
            />

            <p className="text-sm font-medium">{score}/100</p>
        </div>
    );
};

const Section = ({
                     title,
                     data,
                 }: {
    title: string;
    data: any;
}) => {
    return (
        <AccordionItem id={title}>
            <AccordionHeader itemId={title}>
                <div className="flex flex-row gap-4 items-center py-2">
                    <p className="text-2xl font-semibold">{title}</p>

                    <ScoreBadge
                        score={(data?.score || 0) * 20}
                    />
                </div>
            </AccordionHeader>

            <AccordionContent itemId={title}>
                <div className="flex flex-col gap-4 p-4">
                    <p className="text-lg">
                        {data?.comment}
                    </p>

                    <div className="flex flex-col gap-2">
                        {data?.suggestions?.map(
                            (item: string, index: number) => (
                                <div
                                    key={index}
                                    className="bg-yellow-50 border border-yellow-200 rounded-xl p-3"
                                >
                                    {item}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const Details = ({ feedback }: any) => {
    const analysis = feedback?.analysis;

    return (
        <div className="flex flex-col gap-4 w-full">
            <Accordion>
                <Section
                    title="Content"
                    data={analysis?.content}
                />

                <Section
                    title="Skills"
                    data={analysis?.skills}
                />

                <Section
                    title="Experience"
                    data={analysis?.experience}
                />

                <Section
                    title="Relevance"
                    data={analysis?.relevance}
                />
            </Accordion>
        </div>
    );
};

export default Details;