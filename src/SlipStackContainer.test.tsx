import type { SlipStackHandle } from "@/SlipStackContainer";
import { SlipStackContainer } from "@/SlipStackContainer";
import { render, screen } from "@testing-library/react";
import { act, createRef } from "react";

it("appends a new pane and recalculates pane widths", async () => {
    const width = 400;
    const ref = createRef<SlipStackHandle>();
    const paneA = {id: "A", title: "A", element: <span>A-content</span>};
    render(<SlipStackContainer ref={ref} paneData={[paneA]} paneWidth={width}/>);

    // → initially exactly one .pane with full width (= 800 px from mock)
    let panes = screen.getAllByTestId("slipstack-pane");
    expect(panes).toHaveLength(1);

    // 2️⃣  open B imperatively
    act(() => {
        ref.current!.openPane({id: "B", title: "B", element: <span>B-content</span>});
    });

    // → now two panes, both 400 px wide (800 px / 2)
    panes = screen.getAllByTestId("slipstack-pane");
    expect(panes).toHaveLength(2);

    // and the new pane’s content is rendered
    expect(screen.getByText("B-content")).toBeInTheDocument();
});

it("slides panes over the first when width is limited", async () => {
    const minWidth = 300;
    const ref = createRef<SlipStackHandle>();
    const paneA = {id: "A", title: "A", element: <span>A</span>};
    const paneB = {id: "B", title: "B", element: <span>B-content</span>};
    const paneC = {id: "C", title: "C", element: <span>C-content</span>};

    render(<SlipStackContainer ref={ref} paneData={[paneA]} paneWidth={minWidth}/>);

    act(() => {
        ref.current!.openPane(paneB);
    });
    act(() => {
        ref.current!.openPane(paneC);
    });

    const panes = screen.getAllByTestId("slipstack-pane");
    expect(panes).toHaveLength(3);
});

it("creates vertical tabs when panes exceed available width", async () => {
    const width = 300;
    const ref = createRef<SlipStackHandle>();
    const paneA = {id: "A", title: "A", element: <span>A</span>};
    const paneB = {id: "B", title: "B", element: <span>B</span>};
    const paneC = {id: "C", title: "C", element: <span>C</span>};
    const paneD = {id: "D", title: "D", element: <span>D</span>};

    render(<SlipStackContainer ref={ref} paneData={[paneA]} paneWidth={width}/>);

    act(() => {
        ref.current!.openPane(paneB);
    });
    act(() => {
        ref.current!.openPane(paneC);
    });
    act(() => {
        ref.current!.openPane(paneD);
    });

    expect(screen.getAllByTestId("slipstack-pane")).toHaveLength(4);
});
