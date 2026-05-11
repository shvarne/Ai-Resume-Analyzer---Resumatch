import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({
                      title,
                      score,
                  }: {
    title: string;
    score: number;
}) => {
    const textColor =
        score > 70
            ? "text-green-600"
            : score > 49
                ? "text-yellow-600"
                : "text-red-600";

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>

                <p className="text-2xl">
                    <span className={textColor}>{score}</span>
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: any) => {
    const analysis = feedback?.analysis;

    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row items-center p-4 gap-8">
                <ScoreGauge score={((feedback?.rating || 0) * 20)} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">
                        Your Resume Score
                    </h2>

                    <p className="text-sm text-gray-500">
                        This score is calculated based on AI analysis.
                    </p>
                </div>
            </div>

            <Category
                title="Content"
                score={(analysis?.content?.score || 0) * 20}
            />

            <Category
                title="Skills"
                score={(analysis?.skills?.score || 0) * 20}
            />

            <Category
                title="Experience"
                score={(analysis?.experience?.score || 0) * 20}
            />

            <Category
                title="Relevance"
                score={(analysis?.relevance?.score || 0) * 20}
            />
        </div>
    );
};

export default Summary;