"use client";


import React, { useEffect, useMemo } from "react";
import { AiFillStar } from "react-icons/ai";
import { RiChatQuoteFill } from "react-icons/ri";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { toast } from "react-hot-toast";

import Container from "@/components/shared/container/Container";
import HighlightText from "@/components/shared/highlightText/HighlightText";
import LoadImage from "@/components/shared/image/LoadImage";
import { useGetAllReviewsQuery } from "@/services/review/reviewApi";

const animation = { duration: 50000, easing: (t) => t };

const Reviews = ({ className }) => {
  const { isLoading, data, error } = useGetAllReviewsQuery();
  const reviews = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Failed to fetch reviews", {
        id: "reviews",
      });
    } else if (isLoading) {
      toast.loading("Fetching reviews...", { id: "reviews" });
    } else if (data) {
      toast.success(data?.message || "Reviews fetched!", { id: "reviews" });
    }
  }, [isLoading, data, error]);

  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 0,
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 15 },
      },
      "(min-width: 768px)": {
        slides: { perView: 2, spacing: 15 },
      },
      "(min-width: 1080px)": {
        slides: { perView: 3, spacing: 15 },
      },
    },
  });

  const renderDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = (d) => {
      if (d >= 11 && d <= 13) return "th";
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
    return (
      day +
      suffix(day) +
      " " +
      date.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    );
  };

  return (
    <section className="h-full py-12">
      <Container className={className}>
        <div className="flex flex-col gap-y-12">
          <article className="flex flex-col gap-y-4">
            <h1 className="lg:text-5xl md:text-4xl text-3xl">
              <HighlightText>Traveller&apos;s</HighlightText> Review
              <LoadImage
                src="/assets/home-page/destination/underline.svg"
                alt="underline"
                height={7}
                width={275}
                className="mt-1.5"
              />
            </h1>
            <p className="text-base">
              Discover the Impact of Our Products and Services Through Their Testimonials
            </p>
          </article>

          {isLoading && (
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-y-4 border rounded p-3 animate-pulse">
                  <div className="flex items-end gap-x-2.5">
                    <div className="h-[50px] w-[50px] rounded bg-gray-200" />
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col gap-y-1 w-full">
                        <div className="w-2/3 h-4 bg-gray-200 rounded" />
                        <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      </div>
                      <div className="flex flex-col items-end gap-y-1 w-full">
                        <div className="w-2/3 h-4 bg-gray-200 rounded" />
                        <div className="w-3/4 h-4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1.5">
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-full h-4 bg-gray-200 rounded" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && reviews.length === 0 && (
            <p className="text-sm text-red-500">No reviews found!</p>
          )}

          {!isLoading && reviews.length > 0 && (
            <div ref={sliderRef} className="keen-slider">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="group relative flex flex-col gap-y-4 border p-4 rounded hover:border-primary transition-colors keen-slider__slide"
                >
                  <div className="flex items-end gap-x-2.5">
                    <LoadImage
                      src={review?.reviewer?.avatar?.url}
                      alt={review?.reviewer?.avatar?.public_id}
                      width={50}
                      height={50}
                      className="rounded h-[50px] w-[50px] object-cover"
                    />
                    <div className="flex justify-between w-full">
                      <div>
                        <h2>{review?.reviewer?.name}</h2>
                        <p className="text-xs">{review.rent?.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm flex items-center gap-x-1">
                          <AiFillStar className="text-[#F9BC1D]" />
                          {review.rating}
                        </p>
                        <p className="text-xs">{renderDate(review.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm relative line-clamp-4">
                    <RiChatQuoteFill className="absolute top-2 left-2 w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Reviews;