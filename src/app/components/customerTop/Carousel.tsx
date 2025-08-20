import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function TopCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
         loop: true,
      }}
      className="justify-center max-w-7xl bg-yellow-50 items-center "
    >
      <CarouselContent className="">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
            <div className="p-1">
              <Card className="bg-blue-100">
                <CardContent className="flex aspect-square items-center justify-center p-6 ">
                  <span className="text-3xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}

      </CarouselContent >
      <div className="flex ">
      <CarouselPrevious className=""/>
      </div>
      <CarouselNext />
    </Carousel>
  );
}
