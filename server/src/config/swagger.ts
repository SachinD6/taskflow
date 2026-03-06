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
    apis: ["./src/routes/v1/*.ts"],
};

export const swaggerSpec = swaggerJsDoc(options);
