import { useEffect, useState } from "react";
import { MdPause, MdPlayArrow, MdSkipNext } from "react-icons/md";
import { toast } from "react-toastify";
import { HampState, HandyMode } from "lib/thehandy/types";
import RateLimitedSlider from "components/molecules/RateLimitedSlider";
import RateLimitedMinMaxSlider from "components/molecules/RateLimitedMinMaxSlider";
import ProgressRing from "components/atoms/CircularProgress";
import useAnim from "lib/hooks/useAnim";
import Mathf from "lib/Mathf";
import IconButton from "components/atoms/IconButton";
import useHandy from "lib/thehandy-react";
import useKeyboard from "lib/hooks/useKeyboard";

type Range = {
    min: number;
    max: number;
};

const AppRandom = (): JSX.Element => {
    const {
        loading,
        error,
        getSlideSettings,
        getHampVelocity,
        sendHampVelocity,
        sendSlideMin,
        sendSlideMax,
        sendMode,
        sendHampState,
        handyState,
    } = useHandy();

    const [initialized, setInitialized] = useState(false);
    const [slideMax, setSlideMax] = useState(100);

    const [nextRandomTime, setNextRandomTime] = useState(0);
    const [lastRandomTime, setLastRandomTime] = useState(-1);
    const [progress, setProgress] = useState(0);
    const [skip, setSkip] = useState(false);

    const [randomInterval, setRandomInterval] = useState<Range>({
        min: 4,
        max: 15,
    });
    const [randomSpeed, setRandomSpeed] = useState<Range>({
        min: 0,
        max: 100,
    });
    const [randomSlide, setRandomSlide] = useState<Range>({
        min: 20,
        max: 100,
    });

    useAnim(
        (runTime: number, deltaTime: number) => {
            if (!(handyState.hampState === HampState.moving)) {
                setLastRandomTime(cur => cur + deltaTime);
                setNextRandomTime(runTime + deltaTime);
                setProgress(0);
                return;
            }
            if (runTime > nextRandomTime || skip) {
                setLastRandomTime(runTime);
                setNextRandomTime(
                    runTime + Mathf.randomRange(randomInterval.min, randomInterval.max)
                );
                const newVelocity = Math.round(Mathf.randomRange(randomSpeed.min, randomSpeed.max));
                const newSlideMin =
                    slideMax -
                    Math.round(
                        Mathf.randomRange(randomSlide.min, randomSlide.max) * 0.01 * slideMax
                    );
                console.log({ newVelocity, newSlideMin });
                sendHampVelocity(newVelocity);
                sendSlideMin(newSlideMin);
                setSkip(false);
            }
            setProgress((runTime - lastRandomTime) / (nextRandomTime - lastRandomTime));
        },
        [
            nextRandomTime,
            lastRandomTime,
            randomInterval,
            randomSpeed,
            randomSlide,
            slideMax,
            handyState.hampState,
        ]
    );

    useEffect(() => {
        const initialization = async () => {
            setInitialized(true);
            if (handyState.currentMode !== HandyMode.hamp) {
                await sendHampState(HampState.stopped);
                const slideSettings = await getSlideSettings();
                await getHampVelocity();
                setSlideMax(slideSettings.max);
            } else {
                setSlideMax(handyState.slideMax);
            }
        };

        if (!initialized) initialization();
    }, [
        sendMode,
        sendHampState,
        handyState.currentMode,
        handyState.slideMin,
        handyState.slideMax,
        handyState.hampVelocity,
        initialized,
        getSlideSettings,
        getHampVelocity,
    ]);

    const [lastError, setLastError] = useState("");
    useEffect(() => {
        if (error && error != lastError) {
            toast.error(error);
            setLastError(error);
        }
    }, [error]);

    const togglePlay = () => {
        sendHampState(
            handyState.hampState === HampState.moving ? HampState.stopped : HampState.moving
        );
    };

    const doSkip = () => {
        setSkip(true);
    };

    const incrementSlide = (direction: -1 | 1): void => {
        if (direction > 0 && slideMax === 100) return;
        if (direction < 0 && slideMax === 0) return;
        setSlideMax(cur => cur + direction * 10);
        sendSlideMax(slideMax + direction * 10);
    };

    useKeyboard(e => {
        switch (e.key) {
            case " ":
            case "Enter":
                togglePlay();
                break;
            case "ArrowRight":
            case "d":
                doSkip();
                break;
            case "ArrowUp":
            case "w":
                incrementSlide(1);
                break;
            case "ArrowDown":
            case "s":
                incrementSlide(-1);
                break;
        }
    }, []);

    return (
        <div className="flex min-h-mobilemain md:min-h-main flex-col -mt-4 pb-5 pt-5 justify-between">
            <div className="flex flex-col gap-4">
                <RateLimitedMinMaxSlider
                    label="Random Interval"
                    valueUnit="s"
                    min={2}
                    max={22}
                    valueMin={randomInterval.min}
                    valueMax={randomInterval.max}
                    onChangeMin={val => setRandomInterval(cur => ({ ...cur, min: val }))}
                    onChangeMax={val => setRandomInterval(cur => ({ ...cur, max: val }))}
                    ticks={9}
                />
                <RateLimitedMinMaxSlider
                    label="Speed Range"
                    valueUnit="%"
                    min={0}
                    max={100}
                    valueMin={randomSpeed.min}
                    valueMax={randomSpeed.max}
                    onChangeMin={val => setRandomSpeed(cur => ({ ...cur, min: val }))}
                    onChangeMax={val => setRandomSpeed(cur => ({ ...cur, max: val }))}
                />
                <RateLimitedMinMaxSlider
                    label="Stroke Min Range"
                    valueUnit="%"
                    min={0}
                    max={100}
                    valueMin={randomSlide.min}
                    valueMax={randomSlide.max}
                    onChangeMin={val => setRandomSlide(cur => ({ ...cur, min: val }))}
                    onChangeMax={val => setRandomSlide(cur => ({ ...cur, max: val }))}
                />
                <RateLimitedSlider
                    label="Stroke Max"
                    valueUnit="%"
                    min={0}
                    max={100}
                    value={slideMax}
                    disabled={loading}
                    onChange={setSlideMax}
                    onLimitedChange={sendSlideMax}
                />
            </div>
            <div className="flex justify-around items-center">
                <div className="flex flex-col items-center">
                    <IconButton onClick={togglePlay}>
                        {handyState.hampState === HampState.moving ? <MdPause /> : <MdPlayArrow />}
                    </IconButton>
                    <span className="text-sm">
                        {handyState.hampState === HampState.moving ? "Stop" : "Start"}
                    </span>
                </div>
                <div className="h-40 flex flex-col justify-center items-center">
                    <p className="text-sm text-neutral-400">Speed {handyState.hampVelocity}%</p>
                    <div className="relative grid place-items-center flex-grow">
                        <ProgressRing
                            className="absolute"
                            radius={60}
                            stroke={4}
                            progress={
                                handyState.hampState === HampState.moving ? progress * 100 : 100
                            }
                            color="rgb(244,63,94)"
                        />
                        <p className="text-4xl">
                            {handyState.hampState === HampState.moving
                                ? Math.floor(
                                      (1.0 - progress) * (nextRandomTime - lastRandomTime) + 1
                                  )
                                : "-"}
                        </p>
                    </div>
                    <p className="text-sm text-neutral-400">
                        Stroke {handyState.slideMin}% - {handyState.slideMax}%
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <IconButton onClick={doSkip}>
                        <MdSkipNext />
                    </IconButton>
                    <span className="text-sm">Skip</span>
                </div>
            </div>
        </div>
    );
};

export default AppRandom;
