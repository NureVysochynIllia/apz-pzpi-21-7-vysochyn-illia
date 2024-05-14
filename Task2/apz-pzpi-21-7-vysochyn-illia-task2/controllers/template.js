class template {
    async changePrice(request, response) {
        try {
            const {body} = request.body;
            if (!body) {
                return response.status(400).json({message: "Error: Some fields are empty"});
            }

            return response.status(201).json({message: 'X successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to X", error: error.message});
        }
    }
}