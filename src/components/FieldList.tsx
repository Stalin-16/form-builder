import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FormField } from "../types/formTypes";

interface FieldListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onReorderFields: (startIndex: number, endIndex: number) => void;
  onRemoveField: (id: string) => void;
}

const FieldList = ({
  fields,
  selectedFieldId,
  onSelectField,
  onReorderFields,
  onRemoveField,
}: FieldListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex(field => field.id === active.id);
      const newIndex = fields.findIndex(field => field.id === over.id);
      onReorderFields(oldIndex, newIndex);
    }
  };

  return (
    <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Form Fields
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map(field => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <List component="div"> {/* Changed to div to avoid li nesting issues */}
            {fields.map((field) => (
              <ListItem
                key={field.id}
                onClick={() => onSelectField(field.id)}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveField(field.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{
                  backgroundColor: selectedFieldId === field.id
                    ? "action.selected"
                    : undefined,
                  "&:hover": { backgroundColor: "action.hover" },
                  touchAction: 'none',
                }}
              >
                <ListItemText
                  primary={field.label}
                  secondary={field.type}
                />
              </ListItem>
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Paper>
  );
};

export default FieldList;