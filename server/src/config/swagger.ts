import swaggerJsDoc from "swagger-jsdoc";

const options: swaggerJsDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description:
                "A scalable REST API with JWT authentication, role-based access control and CRUD operations on tasks.",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: "http://localhost:{port}/api/v1",
                description: "Development server",
                variables: {
                    port: {
                        default: "5000",
                    },
                },
            },
            {
                url: "https://smg-taskflow.duckdns.org/api/v1",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    // Scan both src (for development) and dist (for production Docker container)
    apis: ["./src/routes/v1/*.ts", "./dist/routes/v1/*.js"],
};

export const swaggerSpec = swaggerJsDoc(options);
