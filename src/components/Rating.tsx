import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function Rating({
    currentRating,
    onSubmitReview,
}: {
    currentRating: number;
    onSubmitReview: (review: { rating: number; comment: string }) => void;
}) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [rating, setRating] = useState(currentRating);
    const [isReviewing, setIsReviewing] = useState(false);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (rating && comment.trim()) {
            onSubmitReview({ rating, comment });
            setIsReviewing(false);
            setComment("");
            setRating(0); // Reset stars
        } else {
            alert("Please provide a rating and a comment.");
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 cursor-pointer ${(hoveredRating ?? rating) >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                            }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => {
                            setRating(star);
                        }}
                    />
                ))}
            </div>

            {isReviewing ? (
                <div className="flex flex-col space-y-2 w-full">
                    <Textarea
                        placeholder="Комментарий"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        onClick={handleSubmit}
                    >
                        Отправить
                    </Button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setIsReviewing(true)}
                >
                    Оставить отзыв
                </Button>
            )}
        </div>
    );
}

export { Rating };
