---
title: "Why the half-marathon is harder than the marathon for bipedal humanoids"
description: "Why the half-marathon is a harder locomotion challenge for bipedal humanoids than the marathon — pacing, thermal load, and control horizon."
date: 2026-04-21
author: Brandon
tags:
  - mens-half-marathon
  - mens-marathon
status: published
---

On April 19, 2026, three autonomous humanoid robots finished a half-marathon in Beijing under the human world record. Honor's Lightning won in 50:26, Thunderbolt followed in 50:56, and Spark took third around 53 minutes. All three ran the course without remote control ([Global Times](https://www.globaltimes.cn/page/202604/1359229.shtml), [NPR](https://www.npr.org/2026/04/20/g-s1-118086/humanoid-robot-half-marathon)). The human men's half-marathon world record is 57:20, set by Jacob Kiplimo in Lisbon in March 2026.

As of this writing, no autonomous humanoid has been documented completing a full marathon at any pace. The 13.1 mile distance has been raced past the human ceiling. The 26.2 mile distance has not been raced at all.

That gap is not what it looks like. The extra 13.1 miles is not simply more of the same problem. For current bipedal humanoid hardware, the first half of a marathon and the second half are different engineering challenges, and three mechanisms explain why.

## Pacing economy

Human runners move faster over the half than the marathon because human physiology has a dynamic range. Elite men in the 2017 Ljubljana race averaged 3.14 m/s over the half and 3.08 m/s over the full, roughly a 2 percent differential ([Nikolaidis & Knechtle, 2019](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6572072/)). At the front of the field the gap widens. Half-marathon pace sits near the lactate threshold, which trained runners can hold for roughly an hour. Marathon pace sits below it, in the aerobic band, because two hours at lactate threshold is not metabolically sustainable.

Humanoid actuators do not have that dynamic range. The brushless motors and power electronics that produce locomotion have a narrow band of efficient operation. Faster gaits push them toward thermal and electrical limits much faster than slower gaits do. A humanoid running at 50-minute half-marathon pace is operating near the ceiling of what current hardware can sustain. Ask the same hardware to hold that pace for 26.2 miles and the question is not whether it finishes slower. The question is whether it finishes.

## Thermal load

Power dissipation in a brushless motor scales with the square of current draw, and current draw scales with the torque required to sustain a given gait at a given speed ([Portescap](https://www.powermotiontech.com/mechatronics/article/21251221/understanding-losses-in-bldc-motors)). Double the torque demand and you quadruple the waste heat. Copper winding temperatures rise, resistance rises with temperature, efficiency drops further, and the motor controller eventually derates output to prevent thermal damage.

The Beijing 2026 results demonstrate how binding this constraint is. Honor's engineering team specifically cited thermal management as a design priority, describing what they called a "powerful liquid-cooling system" developed in-house for Lightning ([NPR](https://www.npr.org/2026/04/20/g-s1-118086/humanoid-robot-half-marathon)). Most current humanoid platforms rely on passive cooling or small forced-air systems sized for demonstration bursts, not sustained output. A half-marathon finished near the winner's time is roughly 50 minutes of sustained near-peak current draw. A marathon at comparable pace would be roughly 100 minutes. Thermal envelopes that tolerate the first do not automatically tolerate the second.

## Control horizon

Bipedal balance is maintained by control loops running at kilohertz rates, correcting small errors before they compound. Over long distances, tiny biases in leg length, foot contact, and sensor drift accumulate. Humans correct this subconsciously through proprioception. Robots correct it through software, and software correction has a horizon.

Beijing 2026 made this visible. Unitree's H1, a pre-race favorite after completing a 1.9 km qualifying segment at 7.51 m/s average ([People's Daily](https://en.people.cn/n3/2026/0420/c90000-20448138.html)), fell near the finish line of the actual half-marathon after a battery replacement and was carried off the course as a DNF ([36Kr](https://eu.36kr.com/en/p/3774636894388739)). Honor's Lightning, the eventual champion, collided with a barricade in the final sprint roughly 200 meters from the finish and had to be righted by staff before crossing ([China Daily](https://www.chinadaily.com.cn/a/202604/19/WS69e43c9da310d6866eb443d5.html)). End-of-race failures are control-horizon failures. Small errors that were correctable at kilometer five become uncorrectable at kilometer twenty. Doubling the distance does not linearly double the risk. It compounds it.

## What this means for the ledger

Bioparity tracks both distances. The men's half-marathon event now carries documented autonomous performances from Beijing 2026. The men's marathon event carries no documented autonomous finisher at any pace. That absence is the story.

Parity on the marathon will likely follow parity on the half, not precede it. The shorter-looking race is where the harder engineering problem is being solved first.
