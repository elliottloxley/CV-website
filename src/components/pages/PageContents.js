const PageContents = {
    work: {
        content: 'root',
        nodes: [
            {
                content: 'item1',
                nodes: [
                    {
                        content: 'item1.1',
                        navID: "test2",
                    },
                    {
                        content: 'item1.2',
                        nodes: [
                            {
                                content: 'item1.2.1',
                                navID: "test4",
                            }
                        ]
                    }
                ]
            },
            {
                content: 'item2',
                navID: "test5",
            }
        ]
    }
}

export default PageContents;